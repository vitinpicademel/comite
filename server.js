const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Servir arquivos estáticos (para produção)
app.use(express.static(path.join(__dirname, '.next')));

// Estado do servidor
let estadoServidor = {
  imovelAtivo: null,
  avaliacaoAtiva: false,
  avaliacoes: [],
  historico: [],
  contador: 0
};

// Mapa para rastrear qual corretor está em qual socket
// Formato: { socketId: { corretor: 'Nome', imovelAtivo: {...} } }
const corretoresConectados = new Map();

// Função para resetar contador diário (meia-noite)
function resetarContadorDiario() {
  const agora = new Date();
  const proximaMeiaNoite = new Date();
  proximaMeiaNoite.setHours(24, 0, 0, 0);
  
  const tempoParaReset = proximaMeiaNoite - agora;
  
  setTimeout(() => {
    estadoServidor.contador = 0;
    estadoServidor.historico = [];
    io.emit('contadorResetado', { contador: 0, historico: [] });
    resetarContadorDiario(); // Agendar próximo reset
  }, tempoParaReset);
}

// Iniciar reset diário
resetarContadorDiario();

// WebSocket connections
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar estado atual ao cliente
  socket.emit('estadoAtual', estadoServidor);

  // Cadastrar imóvel
  socket.on('cadastrarImovel', (data) => {
    if (!data.nome || !data.tipo) {
      socket.emit('erro', 'Dados inválidos para cadastro do imóvel');
      return;
    }

    estadoServidor.imovelAtivo = {
      nome: data.nome,
      tipo: data.tipo
    };
    estadoServidor.avaliacaoAtiva = false;
    estadoServidor.avaliacoes = [];

    io.emit('imovelCadastrado', estadoServidor.imovelAtivo);
    console.log('Imóvel cadastrado:', estadoServidor.imovelAtivo);
  });

  // Iniciar avaliação
  socket.on('iniciarAvaliacao', () => {
    if (!estadoServidor.imovelAtivo) {
      socket.emit('erro', 'Nenhum imóvel cadastrado');
      return;
    }

    estadoServidor.avaliacaoAtiva = true;
    estadoServidor.avaliacoes = [];

    io.emit('avaliacaoIniciada', estadoServidor.imovelAtivo);
    console.log('Avaliação iniciada para:', estadoServidor.imovelAtivo);
  });

  // Receber avaliação do corretor
  socket.on('enviarAvaliacao', (data) => {
    if (!estadoServidor.avaliacaoAtiva) {
      socket.emit('erro', 'Avaliação não está ativa');
      return;
    }

    if (!data.corretor || !data.valor || data.valor <= 0) {
      socket.emit('erro', 'Dados de avaliação inválidos');
      return;
    }

    // Rastrear corretor neste socket
    corretoresConectados.set(socket.id, {
      corretor: data.corretor,
      imovelAtivo: estadoServidor.imovelAtivo
    });

    // Verificar se o corretor já enviou avaliação
    const indexExistente = estadoServidor.avaliacoes.findIndex(
      av => av.corretor === data.corretor
    );

    const avaliacao = {
      corretor: data.corretor,
      valor: parseFloat(data.valor),
      timestamp: new Date()
    };

    if (indexExistente >= 0) {
      // Atualizar avaliação existente
      estadoServidor.avaliacoes[indexExistente] = avaliacao;
    } else {
      // Adicionar nova avaliação
      estadoServidor.avaliacoes.push(avaliacao);
    }

    io.emit('avaliacaoRecebida', avaliacao);
    console.log('Avaliação recebida:', avaliacao);
  });

  // Finalizar avaliação
  socket.on('finalizarAvaliacao', () => {
    if (!estadoServidor.imovelAtivo) {
      socket.emit('erro', 'Nenhum imóvel em avaliação');
      return;
    }

    // Calcular média
    let media = 0;
    if (estadoServidor.avaliacoes.length > 0) {
      const soma = estadoServidor.avaliacoes.reduce((acc, av) => acc + av.valor, 0);
      media = soma / estadoServidor.avaliacoes.length;
    }

    // Adicionar ao histórico
    const historicoItem = {
      nome: estadoServidor.imovelAtivo.nome,
      tipo: estadoServidor.imovelAtivo.tipo,
      media: media,
      avaliacoes: [...estadoServidor.avaliacoes],
      data: new Date()
    };

    estadoServidor.historico.push(historicoItem);
    estadoServidor.contador++;

    // Preparar resultado
    const resultado = {
      imovel: estadoServidor.imovelAtivo,
      avaliacoes: [...estadoServidor.avaliacoes],
      media: media
    };

    // Limpar estado ativo
    estadoServidor.imovelAtivo = null;
    estadoServidor.avaliacaoAtiva = false;
    estadoServidor.avaliacoes = [];

    io.emit('avaliacaoFinalizada', resultado);
    io.emit('estadoAtual', estadoServidor);
    console.log('Avaliação finalizada:', resultado);
  });

  // Solicitar estado atual
  socket.on('solicitarEstado', () => {
    socket.emit('estadoAtual', estadoServidor);
  });

  // Desconexão - remover avaliação do corretor que desconectou
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Verificar se havia um corretor associado a este socket
    const corretorInfo = corretoresConectados.get(socket.id);
    
    if (corretorInfo && estadoServidor.avaliacaoAtiva) {
      const { corretor } = corretorInfo;
      
      // Remover avaliação deste corretor
      const indexRemover = estadoServidor.avaliacoes.findIndex(
        av => av.corretor === corretor
      );
      
      if (indexRemover >= 0) {
        estadoServidor.avaliacoes.splice(indexRemover, 1);
        console.log(`Avaliação de ${corretor} removida devido à desconexão`);
        
        // Notificar todos os clientes sobre a remoção
        io.emit('avaliacaoRemovida', { corretor });
        io.emit('estadoAtual', estadoServidor);
      }
    }
    
    // Remover do mapa de corretores conectados
    corretoresConectados.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
