'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Play, Home, Edit2 } from 'lucide-react'

interface Imovel {
  id: string
  nome: string
  tipo: string
  status?: 'pendente' | 'votando' | 'finalizado'
  created_at: string
}

interface FilaImoveisProps {
  imoveis: Imovel[]
  onIniciar: (imovelId: string) => void
  onEditar?: (imovelId: string) => void
  imovelAtivoId?: string | null
}

export default function FilaImoveis({ imoveis, onIniciar, onEditar, imovelAtivoId }: FilaImoveisProps) {
  if (imoveis.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
          <Clock className="w-5 h-5" />
          Fila de Imóveis
        </h3>
        <p className="text-slate-500 text-center py-4">
          Nenhum imóvel aguardando avaliação
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-brown-light">
        <Clock className="w-5 h-5" />
        Fila de Imóveis Pendentes
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {imoveis.map((imovel, index) => (
            <motion.div
              key={imovel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 bg-slate-900/50 rounded-xl border transition-all ${
                imovelAtivoId === imovel.id
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-white/5 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Home className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{imovel.nome}</p>
                    <p className="text-slate-400 text-sm">{imovel.tipo}</p>
                  </div>
                </div>
                {imovelAtivoId !== imovel.id && (
                  <div className="flex items-center gap-2">
                    {onEditar && (
                      <button
                        onClick={() => onEditar(imovel.id)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                        title="Editar imóvel"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onIniciar(imovel.id)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
                    >
                      <Play className="w-4 h-4" />
                      Iniciar
                    </button>
                  </div>
                )}
                {imovelAtivoId === imovel.id && (
                  <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    Em Votação
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

