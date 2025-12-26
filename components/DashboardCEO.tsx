'use client'

import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  ArrowLeft, 
  Play, 
  Square, 
  TrendingUp,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { obterEstadoAtual, obterHistorico, cadastrarImovel as cadastrar, definirImovelAtivo, iniciarAvaliacao as iniciar, finalizarAvaliacao as finalizar, subscribeEstadoAtual, subscribeAvaliacoes, obterAvaliacoes } from '@/lib/database'
import AnimatedCounter from './AnimatedCounter'
import ResultadosRevelacao from './ResultadosRevelacao'
import HistoricoLista from './HistoricoLista'
import StatusVotacao from './StatusVotacao'

interface Imovel {
  nome: string
  tipo: string
}

interface Avaliacao {
  corretor: string
  valor: number
  timestamp: Date
}

interface HistoricoItem {
  nome: string
  tipo: string
  media: number
  avaliacoes: Avaliacao[]
  data: Date
}

const TIPOS_IMOVEL = [
  'Casa',
  'Apartamento',
  'Terreno',
  'Chácara',
  'Rancho',
  'Sítio',
  'Galpão'
]

export default function DashboardCEO({ socket, onBack }: { socket: Socket | null; onBack: () => void }) {
  const [imovelNome, setImovelNome] = useState('')
  const [imovelTipo, setImovelTipo] = useState('')
  const [imovelAtivo, setImovelAtivo] = useState<Imovel | null>(null)
  const [avaliacaoAtiva, setAvaliacaoAtiva] = useState(false)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [contador, setContador] = useState(0)
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [mediaFinal, setMediaFinal] = useState(0)
  const [imovelResultado, setImovelResultado] = useState<{ nome: string; tipo: string } | null>(null)
  const [modoDatashow, setModoDatashow] = useState(false) // false = mostrar nomes, true = ocultar
  const [useSupabase, setUseSupabase] = useState(false)
  const [corretoresVotaram, setCorretoresVotaram] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (socket) {
      // Usar Socket.IO se disponível
      socket.on('imovelCadastrado', (imovel: Imovel) => {
        setImovelAtivo(imovel)
        setAvaliacaoAtiva(false)
        setAvaliacoes([])
        setMostrarResultados(false)
      })

      socket.on('avaliacaoIniciada', (imovel: Imovel) => {
        setAvaliacaoAtiva(true)
        setImovelAtivo(imovel)
        setAvaliacoes([])
        setMostrarResultados(false)
      })

      socket.on('avaliacaoRecebida', (avaliacao: Avaliacao) => {
        setCorretoresVotaram(prev => new Set([...prev, avaliacao.corretor]))
        setAvaliacoes(prev => {
          const index = prev.findIndex(av => av.corretor === avaliacao.corretor)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = avaliacao
            return updated
          }
          return [...prev, avaliacao]
        })
      })

      socket.on('avaliacaoFinalizada', (resultado: { imovel: Imovel; avaliacoes: Avaliacao[]; media: number }) => {
        setAvaliacaoAtiva(false)
        setMediaFinal(resultado.media)
        setMostrarResultados(true)
        
        const novoHistorico: HistoricoItem = {
          nome: resultado.imovel.nome,
          tipo: resultado.imovel.tipo,
          media: resultado.media,
          avaliacoes: resultado.avaliacoes,
          data: new Date()
        }
        setHistorico(prev => [novoHistorico, ...prev])
        setContador(prev => prev + 1)
      })

      socket.on('estadoAtual', (estado: any) => {
        if (estado.imovelAtivo) setImovelAtivo(estado.imovelAtivo)
        if (estado.avaliacaoAtiva !== undefined) setAvaliacaoAtiva(estado.avaliacaoAtiva)
        if (estado.avaliacoes) setAvaliacoes(estado.avaliacoes)
        if (estado.contador !== undefined) setContador(estado.contador)
        if (estado.historico) setHistorico(estado.historico)
      })

      socket.emit('solicitarEstado')

      return () => {
        socket.off('imovelCadastrado')
        socket.off('avaliacaoIniciada')
        socket.off('avaliacaoRecebida')
        socket.off('avaliacaoFinalizada')
        socket.off('estadoAtual')
      }
    } else {
      // Usar Supabase Realtime
      setUseSupabase(true)
      obterEstadoAtual().then(estado => {
        if (estado?.imovel_ativo_id) {
          supabase.from('imoveis').select('*').eq('id', estado.imovel_ativo_id).single().then(({ data }) => {
            if (data) setImovelAtivo({ nome: data.nome, tipo: data.tipo })
          })
        }
        setAvaliacaoAtiva(estado?.avaliacao_ativa || false)
        setContador(estado?.contador_dia || 0)
      })
      
      obterHistorico().then(async historico => {
        // Buscar quantidade de votos para cada sessão
        const historicoCompleto = await Promise.all(historico.map(async (h) => {
          if (h.imovel_id) {
            const { data: avs } = await supabase
              .from('avaliacoes')
              .select('id')
              .eq('imovel_id', h.imovel_id)
            
            return {
              nome: h.nome_imovel,
              tipo: h.tipo_imovel,
              media: Number(h.media_final),
              avaliacoes: [],
              data: new Date(h.created_at),
              qtdVotos: avs?.length || 0
            }
          }
          return {
            nome: h.nome_imovel,
            tipo: h.tipo_imovel,
            media: Number(h.media_final),
            avaliacoes: [],
            data: new Date(h.created_at),
            qtdVotos: 0
          }
        }))
        setHistorico(historicoCompleto)
      })

      // Subscribe Realtime para estado
      const channelEstado = subscribeEstadoAtual((estado) => {
        if (estado?.imovel_ativo_id) {
          supabase.from('imoveis').select('*').eq('id', estado.imovel_ativo_id).single().then(({ data }) => {
            if (data) setImovelAtivo({ nome: data.nome, tipo: data.tipo })
          })
        } else {
          // Só limpar se não estiver mostrando resultados (evita erro ao finalizar)
          setImovelAtivo(prev => {
            return prev && !mostrarResultados ? null : prev
          })
        }
        const novaAvaliacaoAtiva = estado?.avaliacao_ativa || false
        setAvaliacaoAtiva(novaAvaliacaoAtiva)
        setContador(estado?.contador_dia || 0)
        
        // Se avaliação foi iniciada, carregar avaliações imediatamente
        if (novaAvaliacaoAtiva && estado?.imovel_ativo_id) {
          obterAvaliacoes(estado.imovel_ativo_id).then(avs => {
            console.log('📊 Carregando avaliações existentes:', avs.length)
            setAvaliacoes(avs.map(av => ({
              corretor: av.corretor,
              valor: Number(av.valor),
              timestamp: new Date(av.created_at)
            })))
          })
        } else if (!novaAvaliacaoAtiva) {
          // Limpar avaliações quando avaliação encerra
          setAvaliacoes([])
        }
      })

      return () => {
        channelEstado.unsubscribe()
      }
    }
  }, [socket, mostrarResultados])

  // Subscribe separado para avaliações - reage quando avaliação inicia
  useEffect(() => {
    if (socket) return // Skip se usar Socket.IO
    if (!useSupabase) return // Skip se não usar Supabase
    if (!avaliacaoAtiva || !imovelAtivo) return // Só criar subscription se avaliação estiver ativa

    let channelAvaliacoes: any = null

    const setupAvaliacoes = async () => {
      const estado = await obterEstadoAtual()
      
      if (estado?.imovel_ativo_id && estado.avaliacao_ativa) {
        console.log('🔄 Configurando subscription de avaliações para imóvel:', estado.imovel_ativo_id)
        
        // FILTRO: Subscribe apenas para avaliações deste imóvel específico
        channelAvaliacoes = subscribeAvaliacoes(estado.imovel_ativo_id, (avaliacao) => {
          // VALIDAÇÃO: Verificar se a avaliação recebida é realmente deste imóvel
          if (avaliacao.imovel_id !== estado.imovel_ativo_id) {
            console.warn('⚠️ Avaliação recebida de imóvel diferente! Ignorando...', {
              recebido: avaliacao.imovel_id,
              esperado: estado.imovel_ativo_id
            })
            return
          }

          console.log('✅ Nova avaliação recebida em tempo real para imóvel:', estado.imovel_ativo_id, avaliacao)
          setAvaliacoes(prev => {
            // FILTRO: Garantir que só processamos avaliações deste imóvel
            const index = prev.findIndex(av => av.corretor === avaliacao.corretor)
            if (index >= 0) {
              // Atualizar avaliação existente
              const updated = [...prev]
              updated[index] = {
                corretor: avaliacao.corretor,
                valor: Number(avaliacao.valor),
                timestamp: new Date(avaliacao.created_at)
              }
              console.log('📝 Atualizando avaliação existente. Total:', updated.length)
              return updated
            }
            // Adicionar nova avaliação
            const novo = [...prev, {
              corretor: avaliacao.corretor,
              valor: Number(avaliacao.valor),
              timestamp: new Date(avaliacao.created_at)
            }]
            console.log('➕ Adicionando nova avaliação. Total:', novo.length)
            return novo
          })
        })
      }
    }

    // Executar imediatamente
    setupAvaliacoes()

    return () => {
      if (channelAvaliacoes) {
        console.log('🔌 Desconectando subscription de avaliações')
        channelAvaliacoes.unsubscribe()
      }
    }
  }, [avaliacaoAtiva, imovelAtivo, socket, useSupabase])

  const cadastrarImovel = async () => {
    if (!imovelNome.trim() || !imovelTipo) {
      alert('Preencha todos os campos!')
      return
    }
    
    try {
      if (socket) {
        socket.emit('cadastrarImovel', { nome: imovelNome.trim(), tipo: imovelTipo })
      } else {
        const imovel = await cadastrar(imovelNome.trim(), imovelTipo)
        await definirImovelAtivo(imovel.id)
        setImovelAtivo({ nome: imovel.nome, tipo: imovel.tipo })
      }
      
      setImovelNome('')
      setImovelTipo('')
    } catch (error: any) {
      console.error('Erro ao cadastrar imóvel:', error)
      alert(`Erro ao cadastrar imóvel: ${error.message || 'Verifique se o Supabase está configurado na Vercel'}`)
    }
  }

  const iniciarAvaliacao = async () => {
    if (!imovelAtivo) return
    
    if (socket) {
      socket.emit('iniciarAvaliacao')
    } else {
      await iniciar()
      setAvaliacaoAtiva(true)
      // Limpar avaliações anteriores e garantir que subscription será criado
      setAvaliacoes([])
      
      // Aguardar um pouco e recarregar avaliações FILTRADAS por imovel_id
      setTimeout(async () => {
        const estado = await obterEstadoAtual()
        if (estado?.imovel_ativo_id && estado.avaliacao_ativa) {
          // FILTRO: Carregar apenas avaliações deste imóvel específico
          const avs = await obterAvaliacoes(estado.imovel_ativo_id)
          console.log(`🔄 Recarregando ${avs.length} avaliações para imóvel ${estado.imovel_ativo_id}`)
          setAvaliacoes(avs.map(av => ({
            corretor: av.corretor,
            valor: Number(av.valor),
            timestamp: new Date(av.created_at)
          })))
        }
      }, 500)
    }
  }

  const finalizarAvaliacao = async () => {
    if (!imovelAtivo) {
      alert('Nenhum imóvel em avaliação')
      return
    }
    
    // SALVAR o imóvel ANTES de finalizar (pode ser limpo pelo Realtime)
    const imovelSalvo = { ...imovelAtivo }
    
    try {
      if (socket) {
        socket.emit('finalizarAvaliacao')
      } else {
        const resultado = await finalizar()
        setAvaliacaoAtiva(false)
        setMediaFinal(resultado.media)
        setImovelResultado(imovelSalvo) // Usar o imóvel salvo
        setMostrarResultados(true)
        
        // Adicionar ao histórico usando o imóvel salvo
        const novoHistorico: HistoricoItem = {
          nome: imovelSalvo.nome,
          tipo: imovelSalvo.tipo,
          media: resultado.media,
          avaliacoes: resultado.avaliacoes.map(av => ({
            corretor: av.corretor,
            valor: Number(av.valor),
            timestamp: new Date(av.created_at)
          })),
          data: new Date()
        }
        setHistorico(prev => [novoHistorico, ...prev])
        setContador(prev => prev + 1)
        setImovelAtivo(null) // Limpar apenas depois de usar
      }
    } catch (error: any) {
      console.error('Erro ao finalizar avaliação:', error)
      alert(`Erro ao finalizar avaliação: ${error.message || 'Erro desconhecido'}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com Contador */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Painel CEO</h1>
                <p className="text-slate-400 text-sm">Controle de Avaliações</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-cyan-500" />
              <div>
                <p className="text-slate-400 text-sm">Imóveis Avaliados Hoje</p>
                <AnimatedCounter value={contador} className="text-3xl md:text-4xl font-bold text-cyan-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Cadastro e Controle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form de Cadastro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                Cadastro de Imóvel
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome/Identificador
                  </label>
                  <input
                    type="text"
                    value={imovelNome}
                    onChange={(e) => setImovelNome(e.target.value)}
                    placeholder="Ex: Casa na Rua das Flores, 123"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={imovelTipo}
                    onChange={(e) => setImovelTipo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_IMOVEL.map(tipo => (
                      <option key={tipo} value={tipo} className="bg-slate-900">
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={cadastrarImovel}
                  className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-[1.02]"
                >
                  Cadastrar Imóvel
                </button>
              </div>
            </motion.div>

            {/* Imóvel Ativo */}
            <AnimatePresence>
              {imovelAtivo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-2xl p-6 border border-cyan-500/30"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-500" />
                    Imóvel em Avaliação
                  </h2>
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                    <p className="text-slate-300 mb-1">
                      <span className="text-slate-500">Nome:</span> {imovelAtivo.nome}
                    </p>
                    <p className="text-slate-300">
                      <span className="text-slate-500">Tipo:</span> {imovelAtivo.tipo}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {!avaliacaoAtiva ? (
                      <button
                        onClick={iniciarAvaliacao}
                        className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Iniciar Rodada
                      </button>
                    ) : (
                      <button
                        onClick={finalizarAvaliacao}
                        className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <Square className="w-5 h-5" />
                        Encerrar e Salvar
                      </button>
                    )}
                  </div>
                  {avaliacaoAtiva && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2 text-cyan-400 text-sm">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span>Avaliação em andamento - {avaliacoes.length} voto(s) recebido(s)</span>
                      </div>
                      {/* Botão Modo Datashow */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setModoDatashow(!modoDatashow)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                        >
                          {modoDatashow ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {modoDatashow ? 'Mostrar Detalhes' : 'Ocultar Nomes'}
                        </button>
                      </div>
                      {/* Status de Votação - CEO sempre vê valores */}
                      <StatusVotacao 
                        avaliacoes={avaliacoes} 
                        mostrarValores={true} // CEO sempre vê valores
                        modoDatashow={modoDatashow}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resultados */}
            <AnimatePresence>
              {mostrarResultados && imovelResultado && (
                <ResultadosRevelacao
                  avaliacoes={avaliacoes}
                  media={mediaFinal}
                  imovel={imovelResultado}
                  modoDatashow={modoDatashow}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Coluna Direita - Histórico */}
          <div className="lg:col-span-1">
            <HistoricoLista historico={historico} />
          </div>
        </div>
      </div>
    </div>
  )
}

