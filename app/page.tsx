'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import DashboardCEO from '@/components/DashboardCEO'
import DashboardCorretor from '@/components/DashboardCorretor'
import { Building2 } from 'lucide-react'

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [view, setView] = useState<'select' | 'ceo' | 'corretor' | 'ceo-auth'>('select')
  const [connected, setConnected] = useState(false)
  const [useSupabase, setUseSupabase] = useState(false)
  const [ceoAuthenticated, setCeoAuthenticated] = useState(false)

  useEffect(() => {
    // SEMPRE usar Supabase em produção (Vercel)
    // Socket.IO apenas para desenvolvimento local
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isProduction = process.env.NODE_ENV === 'production' || 
                        (typeof window !== 'undefined' && !window.location.hostname.includes('localhost'))
    
    const hasSupabase = supabaseUrl && 
                        supabaseKey && 
                        !supabaseUrl.includes('placeholder') && 
                        !supabaseKey.includes('placeholder') &&
                        supabaseUrl.includes('.supabase.co')
    
    if (hasSupabase || isProduction) {
      // Usar Supabase Realtime (funciona em produção/Vercel)
      setUseSupabase(true)
      setConnected(true)
      console.log('✅ Usando Supabase Realtime')
      
      if (!hasSupabase && isProduction) {
        console.error('❌ Supabase não configurado! Configure as variáveis de ambiente na Vercel.')
      }
    } else {
      // Fallback para Socket.IO (apenas desenvolvimento local)
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
      
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 5000,
      })

      newSocket.on('connect', () => {
        setConnected(true)
        console.log('Conectado ao servidor Socket.IO (desenvolvimento local)')
      })

      newSocket.on('disconnect', () => {
        setConnected(false)
        console.log('Desconectado do servidor Socket.IO')
      })

      newSocket.on('connect_error', (error) => {
        console.error('Erro de conexão Socket.IO:', error.message)
        setConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [])

  if (view === 'select') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 bg-emerald-500/20 rounded-2xl">
              <Building2 className="w-16 h-16 text-emerald-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Comitê Avaliativo Imobiliário
            </h1>
            <p className="text-slate-400 text-lg">
              Sistema de avaliação em tempo real
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView('ceo-auth')}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105"
            >
              Painel CEO
            </button>
            <button
              onClick={() => setView('corretor')}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700 hover:border-slate-600 hover:scale-105"
            >
              Painel Corretor
            </button>
          </div>

          <div className="pt-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${(connected || useSupabase) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${(connected || useSupabase) ? 'bg-cyan-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium">
                {(connected || useSupabase) ? (useSupabase ? 'Conectado (Supabase)' : 'Conectado') : 'Conectando...'}
              </span>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/50">
            <p className="text-slate-500 text-sm text-center">
              Sistema desenvolvido por <span className="text-cyan-400 font-semibold">Kaká</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Se usar Supabase, não precisa esperar socket
  if (!useSupabase && (!socket || !connected)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400 mb-2">Conectando ao servidor...</p>
        </div>
      </div>
    )
  }

  // Tela de autenticação CEO
  if (view === 'ceo-auth') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-12 max-w-md w-full space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-cyan-400">Acesso CEO</h2>
            <p className="text-slate-400">Digite a senha para acessar o painel</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const senha = formData.get('senha') as string
              if (senha === 'admin123') {
                setCeoAuthenticated(true)
                setView('ceo')
              } else {
                alert('Senha incorreta!')
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setView('select')}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/50"
              >
                Entrar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {view === 'ceo' && ceoAuthenticated && (
        <DashboardCEO socket={useSupabase ? null : socket} onBack={() => {
          setCeoAuthenticated(false)
          setView('select')
        }} />
      )}
      {view === 'corretor' && <DashboardCorretor socket={useSupabase ? null : socket} onBack={() => setView('select')} />}
    </div>
  )
}

