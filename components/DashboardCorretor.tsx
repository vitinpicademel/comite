'use client'

import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, Send, CheckCircle2, Clock } from 'lucide-react'
import { obterEstadoAtual, obterImovelAtivo, enviarAvaliacao as enviar, subscribeEstadoAtual } from '@/lib/database'

interface Imovel {
  nome: string
  tipo: string
}

export default function DashboardCorretor({ socket, onBack }: { socket: Socket | null; onBack: () => void }) {
  const [nomeCorretor, setNomeCorretor] = useState('')
  const [corretorAtivo, setCorretorAtivo] = useState(false)
  const [imovelAtivo, setImovelAtivo] = useState<Imovel | null>(null)
  const [avaliacaoAtiva, setAvaliacaoAtiva] = useState(false)
  const [valor, setValor] = useState('')
  const [votoEnviado, setVotoEnviado] = useState(false)
  const [mensagemStatus, setMensagemStatus] = useState('')

  useEffect(() => {
    if (socket) {
      // Usar Socket.IO se disponível
      socket.on('avaliacaoIniciada', (imovel: Imovel) => {
        setImovelAtivo(imovel)
        setAvaliacaoAtiva(true)
        setVotoEnviado(false)
        setValor('')
        setMensagemStatus('')
      })

      socket.on('avaliacaoFinalizada', () => {
        setAvaliacaoAtiva(false)
        setImovelAtivo(null)
        setVotoEnviado(false)
        setValor('')
        setMensagemStatus('Avaliação encerrada. Aguarde o próximo imóvel.')
      })

      socket.on('estadoAtual', (estado: any) => {
        if (estado.imovelAtivo) setImovelAtivo(estado.imovelAtivo)
        if (estado.avaliacaoAtiva !== undefined) setAvaliacaoAtiva(estado.avaliacaoAtiva)
      })

      socket.emit('solicitarEstado')

      return () => {
        socket.off('avaliacaoIniciada')
        socket.off('avaliacaoFinalizada')
        socket.off('estadoAtual')
      }
    } else {
      // Usar Supabase Realtime
      obterEstadoAtual().then(estado => {
        if (estado?.imovel_ativo_id && estado.avaliacao_ativa) {
          obterImovelAtivo().then(imovel => {
            if (imovel) setImovelAtivo({ nome: imovel.nome, tipo: imovel.tipo })
          })
        }
        setAvaliacaoAtiva(estado?.avaliacao_ativa || false)
      })

      // Subscribe Realtime
      const channel = subscribeEstadoAtual(async (estado) => {
        if (estado?.imovel_ativo_id && estado.avaliacao_ativa) {
          const imovel = await obterImovelAtivo()
          if (imovel) {
            setImovelAtivo({ nome: imovel.nome, tipo: imovel.tipo })
            setAvaliacaoAtiva(true)
            setVotoEnviado(false)
            setValor('')
          }
        } else {
          setAvaliacaoAtiva(false)
          setImovelAtivo(null)
          if (!estado?.avaliacao_ativa) {
            setMensagemStatus('Avaliação encerrada. Aguarde o próximo imóvel.')
          }
        }
      })

      return () => {
        channel.unsubscribe()
      }
    }
  }, [socket])

  const entrarComoCorretor = () => {
    if (!nomeCorretor.trim()) {
      alert('Digite seu nome!')
      return
    }
    setCorretorAtivo(true)
  }

  const formatarMoeda = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '')
    
    if (!apenasNumeros) return ''
    
    // Converte para número e divide por 100 para ter centavos
    const numero = parseInt(apenasNumeros, 10) / 100
    
    // Formata como moeda brasileira
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarMoeda(e.target.value)
    setValor(valorFormatado)
  }

  const enviarAvaliacao = async () => {
    if (!valor || !avaliacaoAtiva) {
      setMensagemStatus('Avaliação não está ativa no momento!')
      return
    }

    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'))
    
    if (!valorNumerico || valorNumerico <= 0) {
      setMensagemStatus('Digite um valor válido!')
      return
    }

    if (socket) {
      socket.emit('enviarAvaliacao', {
        corretor: nomeCorretor.trim(),
        valor: valorNumerico
      })
    } else {
      const estado = await obterEstadoAtual()
      if (estado?.imovel_ativo_id) {
        await enviar(estado.imovel_ativo_id, nomeCorretor.trim(), valorNumerico)
      }
    }

    setVotoEnviado(true)
    setMensagemStatus('Voto registrado! Aguarde o resultado no telão.')
    setValor('')

    setTimeout(() => {
      setMensagemStatus('')
    }, 5000)
  }

  if (!corretorAtivo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-8 max-w-md w-full"
        >
          <button
            onClick={onBack}
            className="mb-6 p-2 hover:bg-slate-800 rounded-lg transition-colors inline-flex"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Painel Corretor
          </h1>
          <p className="text-slate-400 mb-6">Digite seu nome para começar</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome do Corretor
              </label>
              <input
                type="text"
                value={nomeCorretor}
                onChange={(e) => setNomeCorretor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && entrarComoCorretor()}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={entrarComoCorretor}
              className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-[1.02]"
            >
              Entrar
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Painel Corretor</h1>
                <p className="text-slate-400 text-sm">{nomeCorretor}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Imóvel Ativo */}
        <AnimatePresence>
          {imovelAtivo && avaliacaoAtiva ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-6 border border-emerald-500/30"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-500" />
                Imóvel em Avaliação
              </h2>
              <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                <p className="text-slate-300 mb-2">
                  <span className="text-slate-500">Nome:</span> {imovelAtivo.nome}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Tipo:</span> {imovelAtivo.tipo}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Valor da Avaliação (R$)
                  </label>
                  <input
                    type="text"
                    value={valor ? `R$ ${valor}` : ''}
                    onChange={handleValorChange}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-2xl font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all number-display"
                  />
                </div>

                <AnimatePresence>
                  {votoEnviado && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-emerald-400 font-medium">Voto enviado com sucesso!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mensagemStatus && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl ${
                      mensagemStatus.includes('registrado') 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                        : 'bg-red-500/20 border border-red-500/50 text-red-400'
                    }`}
                  >
                    {mensagemStatus}
                  </motion.div>
                )}

                <button
                  onClick={enviarAvaliacao}
                  disabled={!valor || votoEnviado}
                  className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {votoEnviado ? 'Voto Enviado' : 'Enviar Avaliação'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                Aguardando início da avaliação...
              </p>
              <p className="text-slate-500 text-sm mt-2">
                O CEO iniciará uma nova rodada em breve
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

