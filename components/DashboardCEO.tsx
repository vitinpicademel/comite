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
  CheckCircle2
} from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import ResultadosRevelacao from './ResultadosRevelacao'
import HistoricoLista from './HistoricoLista'

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

export default function DashboardCEO({ socket, onBack }: { socket: Socket; onBack: () => void }) {
  const [imovelNome, setImovelNome] = useState('')
  const [imovelTipo, setImovelTipo] = useState('')
  const [imovelAtivo, setImovelAtivo] = useState<Imovel | null>(null)
  const [avaliacaoAtiva, setAvaliacaoAtiva] = useState(false)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [contador, setContador] = useState(0)
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [mediaFinal, setMediaFinal] = useState(0)

  useEffect(() => {
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
  }, [socket])

  const cadastrarImovel = () => {
    if (!imovelNome.trim() || !imovelTipo) {
      alert('Preencha todos os campos!')
      return
    }
    socket.emit('cadastrarImovel', { nome: imovelNome.trim(), tipo: imovelTipo })
    setImovelNome('')
    setImovelTipo('')
  }

  const iniciarAvaliacao = () => {
    if (!imovelAtivo) return
    socket.emit('iniciarAvaliacao')
  }

  const finalizarAvaliacao = () => {
    if (!imovelAtivo) return
    socket.emit('finalizarAvaliacao')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com Contador */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 border border-emerald-500/20"
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
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-slate-400 text-sm">Imóveis Avaliados Hoje</p>
                <AnimatedCounter value={contador} className="text-3xl md:text-4xl font-bold text-emerald-500" />
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
                <Building2 className="w-5 h-5 text-emerald-500" />
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
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={imovelTipo}
                    onChange={(e) => setImovelTipo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                  className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-[1.02]"
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
                  className="glass rounded-2xl p-6 border border-emerald-500/30"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-emerald-500" />
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
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-[1.02] flex items-center justify-center gap-2"
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
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Avaliação em andamento - {avaliacoes.length} voto(s) recebido(s)</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resultados */}
            <AnimatePresence>
              {mostrarResultados && (
                <ResultadosRevelacao
                  avaliacoes={avaliacoes}
                  media={mediaFinal}
                  imovel={imovelAtivo!}
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

