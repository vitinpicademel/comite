'use client'

import { motion } from 'framer-motion'
import { History, Home } from 'lucide-react'

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
  qtdVotos?: number
}

interface HistoricoListaProps {
  historico: HistoricoItem[]
}

export default function HistoricoLista({ historico }: HistoricoListaProps) {
  if (historico.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-500" />
          Histórico da Sessão
        </h2>
        <p className="text-slate-500 text-center py-8">
          Nenhum imóvel avaliado ainda
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-brown-light" />
        Histórico da Sessão
      </h2>
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {historico.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-strong rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Home className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{item.nome}</h3>
                <p className="text-slate-400 text-sm">{item.tipo}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Média:</span>
                <span className="text-cyan-400 font-bold number-display">
                  R$ {item.media.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">
                  {new Date(item.data).toLocaleString('pt-BR')}
                </span>
                <span className="text-slate-500 text-xs">
                  {item.qtdVotos || item.avaliacoes.length} voto(s)
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

