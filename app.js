// Conectar ao servidor WebSocket
const socket = io();

// Estado da aplicação
let estado = {
    imovelAtivo: null,
    avaliacaoAtiva: false,
    avaliacoes: [],
    historico: [],
    contador: 0
};

// Elementos do DOM - CEO
const ceoPanel = document.getElementById('ceoPanel');
const imovelNomeInput = document.getElementById('imovelNome');
const imovelTipoSelect = document.getElementById('imovelTipo');
const cadastrarImovelBtn = document.getElementById('cadastrarImovel');
const activePropertySection = document.getElementById('activePropertySection');
const activeNome = document.getElementById('activeNome');
const activeTipo = document.getElementById('activeTipo');
const iniciarAvaliacaoBtn = document.getElementById('iniciarAvaliacao');
const finalizarAvaliacaoBtn = document.getElementById('finalizarAvaliacao');
const resultsSection = document.getElementById('resultsSection');
const avaliacoesList = document.getElementById('avaliacoesList');
const mediaFinal = document.getElementById('mediaFinal');
const counter = document.getElementById('counter');
const historicoList = document.getElementById('historicoList');

// Elementos do DOM - Corretor
const corretorPanel = document.getElementById('corretorPanel');
const corretorNomeInput = document.getElementById('corretorNome');
const entrarComoCorretorBtn = document.getElementById('entrarComoCorretor');
const corretorActiveSection = document.getElementById('corretorActiveSection');
const corretorAtivoNome = document.getElementById('corretorAtivoNome');
const propertyDisplay = document.getElementById('propertyDisplay');
const displayNome = document.getElementById('displayNome');
const displayTipo = document.getElementById('displayTipo');
const avaliacaoSection = document.getElementById('avaliacaoSection');
const valorAvaliacaoInput = document.getElementById('valorAvaliacao');
const enviarAvaliacaoBtn = document.getElementById('enviarAvaliacao');
const avaliacaoStatus = document.getElementById('avaliacaoStatus');
const waitingMessage = document.getElementById('waitingMessage');

// Event Listeners - CEO
cadastrarImovelBtn.addEventListener('click', () => {
    const nome = imovelNomeInput.value.trim();
    const tipo = imovelTipoSelect.value;

    if (!nome || !tipo) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    socket.emit('cadastrarImovel', { nome, tipo });
    imovelNomeInput.value = '';
    imovelTipoSelect.value = '';
});

iniciarAvaliacaoBtn.addEventListener('click', () => {
    if (!estado.imovelAtivo) return;
    socket.emit('iniciarAvaliacao');
});

finalizarAvaliacaoBtn.addEventListener('click', () => {
    if (!estado.imovelAtivo) return;
    socket.emit('finalizarAvaliacao');
});

// Event Listeners - Corretor
entrarComoCorretorBtn.addEventListener('click', () => {
    const nome = corretorNomeInput.value.trim();
    if (!nome) {
        alert('Por favor, digite seu nome!');
        return;
    }
    socket.emit('entrarComoCorretor', nome);
    corretorAtivoNome.textContent = nome;
    corretorActiveSection.style.display = 'block';
    corretorNomeInput.disabled = true;
    entrarComoCorretorBtn.disabled = true;
});

enviarAvaliacaoBtn.addEventListener('click', () => {
    const valor = parseFloat(valorAvaliacaoInput.value);
    const nomeCorretor = corretorAtivoNome.textContent;

    if (!valor || valor <= 0) {
        mostrarStatus('Por favor, digite um valor válido!', 'error');
        return;
    }

    if (!estado.avaliacaoAtiva) {
        mostrarStatus('A avaliação não está ativa no momento!', 'error');
        return;
    }

    socket.emit('enviarAvaliacao', {
        corretor: nomeCorretor,
        valor: valor
    });

    valorAvaliacaoInput.value = '';
    mostrarStatus('Avaliação enviada com sucesso!', 'success');
});

// Funções auxiliares
function mostrarStatus(mensagem, tipo) {
    avaliacaoStatus.textContent = mensagem;
    avaliacaoStatus.className = `status-message ${tipo}`;
    setTimeout(() => {
        avaliacaoStatus.textContent = '';
        avaliacaoStatus.className = 'status-message';
    }, 3000);
}

function atualizarContador() {
    counter.textContent = estado.contador;
}

function atualizarHistorico() {
    if (estado.historico.length === 0) {
        historicoList.innerHTML = '<p class="empty-message">Nenhum imóvel avaliado ainda.</p>';
        return;
    }

    historicoList.innerHTML = estado.historico.map(item => `
        <div class="historico-item">
            <h3>${item.nome}</h3>
            <p><strong>Tipo:</strong> ${item.tipo}</p>
            <p><strong>Média Final:</strong> R$ ${item.media.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><strong>Avaliado em:</strong> ${new Date(item.data).toLocaleString('pt-BR')}</p>
        </div>
    `).join('');
}

function calcularMedia(valores) {
    if (valores.length === 0) return 0;
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return soma / valores.length;
}

function exibirResultados() {
    if (estado.avaliacoes.length === 0) {
        avaliacoesList.innerHTML = '<p>Nenhuma avaliação recebida.</p>';
        return;
    }

    avaliacoesList.innerHTML = estado.avaliacoes.map(av => `
        <div class="avaliacao-item">
            <span><strong>${av.corretor}</strong></span>
            <span>R$ ${av.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
    `).join('');

    const media = calcularMedia(estado.avaliacoes.map(av => av.valor));
    mediaFinal.textContent = media.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Eventos do Socket.IO
socket.on('imovelCadastrado', (imovel) => {
    estado.imovelAtivo = imovel;
    activeNome.textContent = imovel.nome;
    activeTipo.textContent = imovel.tipo;
    activePropertySection.style.display = 'block';
    iniciarAvaliacaoBtn.style.display = 'inline-block';
    finalizarAvaliacaoBtn.style.display = 'none';
    resultsSection.style.display = 'none';
    estado.avaliacoes = [];
    estado.avaliacaoAtiva = false;
});

socket.on('avaliacaoIniciada', (imovel) => {
    estado.avaliacaoAtiva = true;
    estado.imovelAtivo = imovel;
    iniciarAvaliacaoBtn.style.display = 'none';
    finalizarAvaliacaoBtn.style.display = 'inline-block';
    resultsSection.style.display = 'none';
    estado.avaliacoes = [];
    
    // Atualizar painel do corretor
    if (propertyDisplay) {
        displayNome.textContent = imovel.nome;
        displayTipo.textContent = imovel.tipo;
        propertyDisplay.style.display = 'block';
        avaliacaoSection.style.display = 'block';
        waitingMessage.style.display = 'none';
    }
});

socket.on('avaliacaoRecebida', (avaliacao) => {
    estado.avaliacoes.push(avaliacao);
    exibirResultados();
});

socket.on('avaliacaoFinalizada', (resultado) => {
    estado.avaliacaoAtiva = false;
    iniciarAvaliacaoBtn.style.display = 'inline-block';
    finalizarAvaliacaoBtn.style.display = 'none';
    resultsSection.style.display = 'block';
    exibirResultados();
    
    // Adicionar ao histórico
    const historicoItem = {
        nome: resultado.imovel.nome,
        tipo: resultado.imovel.tipo,
        media: resultado.media,
        data: new Date()
    };
    estado.historico.push(historicoItem);
    estado.contador++;
    atualizarContador();
    atualizarHistorico();
    
    // Limpar imóvel ativo
    estado.imovelAtivo = null;
    activePropertySection.style.display = 'none';
    
    // Atualizar painel do corretor
    if (propertyDisplay) {
        propertyDisplay.style.display = 'none';
        avaliacaoSection.style.display = 'none';
        waitingMessage.style.display = 'block';
    }
});

socket.on('estadoAtual', (estadoServidor) => {
    estado = { ...estado, ...estadoServidor };
    
    // Atualizar contador
    atualizarContador();
    
    // Atualizar histórico
    atualizarHistorico();
    
    // Atualizar painel CEO
    if (estado.imovelAtivo) {
        activeNome.textContent = estado.imovelAtivo.nome;
        activeTipo.textContent = estado.imovelAtivo.tipo;
        activePropertySection.style.display = 'block';
        
        if (estado.avaliacaoAtiva) {
            iniciarAvaliacaoBtn.style.display = 'none';
            finalizarAvaliacaoBtn.style.display = 'inline-block';
            exibirResultados();
            resultsSection.style.display = 'block';
        } else {
            iniciarAvaliacaoBtn.style.display = 'inline-block';
            finalizarAvaliacaoBtn.style.display = 'none';
        }
    }
    
    // Atualizar painel corretor
    if (estado.avaliacaoAtiva && estado.imovelAtivo) {
        displayNome.textContent = estado.imovelAtivo.nome;
        displayTipo.textContent = estado.imovelAtivo.tipo;
        propertyDisplay.style.display = 'block';
        avaliacaoSection.style.display = 'block';
        waitingMessage.style.display = 'none';
    } else if (corretorActiveSection.style.display === 'block') {
        propertyDisplay.style.display = 'none';
        avaliacaoSection.style.display = 'none';
        waitingMessage.style.display = 'block';
    }
});

// Carregar estado ao conectar
socket.on('connect', () => {
    socket.emit('solicitarEstado');
});

