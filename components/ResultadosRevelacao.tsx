'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users } from 'lucide-react'

interface Avaliacao {
  corretor: string
  valor: number
  timestamp: Date
}

interface ResultadosRevelacaoProps {
  avaliacoes: Avaliacao[]
  media: number
  imovel: { nome: string; tipo: string }
  modoDatashow?: boolean
}

export default function ResultadosRevelacao({ avaliacoes, media, imovel, modoDatashow = false }: ResultadosRevelacaoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 border border-cyan-500/30"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-cyan-500" />
        Resultados da Avaliação
      </h2>

      <div className="mb-6">
        <p className="text-slate-400 mb-1">Imóvel: <span className="text-white font-semibold">{imovel.nome}</span></p>
        <p className="text-slate-400">Tipo: <span className="text-white font-semibold">{imovel.tipo}</span></p>
      </div>

      {/* Lista de Avaliações com Animação */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {avaliacoes.map((avaliacao, index) => (
            <motion.div
              key={`${avaliacao.corretor}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4 flex items-center justify-between border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-500" />
                </div>
                <span className={`text-white font-medium ${modoDatashow ? 'blur-sm' : ''}`}>
                {modoDatashow ? 'Corretor' : avaliacao.corretor}
              </span>
              </div>
              <span className={`text-cyan-400 font-bold text-lg number-display ${modoDatashow ? 'blur-sm' : ''}`}>
                R$ {avaliacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Média Final com Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: avaliacoes.length * 0.1 + 0.2 }}
        className="relative bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-8 border-2 border-cyan-500/50"
      >
        <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl animate-glow" />
        <div className="relative text-center">
          <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Média Final</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="text-5xl md:text-6xl font-bold text-cyan-400 number-display"
          >
            R$ {media.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

