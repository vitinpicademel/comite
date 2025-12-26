'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Users } from 'lucide-react'

interface StatusVotacaoProps {
  avaliacoes: Array<{ corretor: string; valor: number; timestamp?: Date }>
  mostrarValores: boolean
  modoDatashow: boolean
}

export default function StatusVotacao({ avaliacoes, mostrarValores, modoDatashow }: StatusVotacaoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-cyan-400">
          <Users className="w-5 h-5" />
          Status de Votação
        </h3>
        <span className="text-sm text-slate-400">
          {avaliacoes.length} voto(s)
        </span>
      </div>
      
      <div className="space-y-2">
        {avaliacoes.map((avaliacao, index) => (
          <motion.div
            key={`${avaliacao.corretor}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 ${
              modoDatashow ? 'blur-sm' : ''
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <span className="text-white font-medium truncate">
                {modoDatashow ? 'Corretor' : avaliacao.corretor}
              </span>
              {!modoDatashow && (
                <span className="text-cyan-400 font-bold number-display ml-auto">
                  R$ {avaliacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            {modoDatashow ? (
              <div className="flex items-center gap-2 text-cyan-400 ml-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Votou</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 ml-2">
                <span className="text-xs">✓</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

