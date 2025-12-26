'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import DashboardCEO from '@/components/DashboardCEO'
import DashboardCorretor from '@/components/DashboardCorretor'
import { Building2 } from 'lucide-react'

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [view, setView] = useState<'select' | 'ceo' | 'corretor'>('select')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('Conectado ao servidor')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('Desconectado do servidor')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Comitê Avaliativo Imobiliário
            </h1>
            <p className="text-slate-400 text-lg">
              Sistema de avaliação em tempo real
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView('ceo')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-105"
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
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium">
                {connected ? 'Conectado' : 'Conectando...'}
              </span>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/50">
            <p className="text-slate-500 text-sm text-center">
              Sistema desenvolvido por <span className="text-emerald-400 font-semibold">Kaká</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!socket || !connected) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Conectando ao servidor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {view === 'ceo' && <DashboardCEO socket={socket} onBack={() => setView('select')} />}
      {view === 'corretor' && <DashboardCorretor socket={socket} onBack={() => setView('select')} />}
    </div>
  )
}

