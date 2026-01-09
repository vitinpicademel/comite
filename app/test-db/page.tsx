'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, XCircle, Loader2, Database } from 'lucide-react'

export default function TestDBPage() {
  const [tests, setTests] = useState<{
    connection: 'pending' | 'success' | 'error'
    tables: 'pending' | 'success' | 'error'
    realtime: 'pending' | 'success' | 'error'
    write: 'pending' | 'success' | 'error'
  }>({
    connection: 'pending',
    tables: 'pending',
    realtime: 'pending',
    write: 'pending'
  })
  
  const [messages, setMessages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const addMessage = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'
    setMessages(prev => [...prev, `${icon} ${msg}`])
  }

  useEffect(() => {
    runTests()
  }, [])

  async function runTests() {
    setLoading(true)
    setMessages([])
    addMessage('Iniciando testes de conexão...')

    // Teste 1: Conexão básica
    try {
      addMessage('Testando conexão básica...')
      const { data, error } = await supabase.from('estado_atual').select('count').limit(1)
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('not found')) {
          setTests(prev => ({ ...prev, connection: 'error' }))
          addMessage('Tabela estado_atual não encontrada! Execute o schema.sql', 'error')
          addMessage('Vá em SQL Editor no Supabase e execute supabase/schema.sql', 'error')
          setLoading(false)
          return
        }
        throw error
      }
      
      setTests(prev => ({ ...prev, connection: 'success' }))
      addMessage('Conexão estabelecida com sucesso!', 'success')
    } catch (error: any) {
      setTests(prev => ({ ...prev, connection: 'error' }))
      addMessage(`Erro na conexão: ${error.message}`, 'error')
      setLoading(false)
      return
    }

    // Teste 2: Verificar tabelas
    addMessage('Verificando tabelas...')
    const tables = ['imoveis', 'avaliacoes', 'sessoes', 'estado_atual']
    let allExist = true
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          addMessage(`Tabela ${table} não encontrada`, 'error')
          allExist = false
        } else {
          addMessage(`Tabela ${table} existe`, 'success')
        }
      } catch (error: any) {
        addMessage(`Erro ao verificar ${table}: ${error.message}`, 'error')
        allExist = false
      }
    }
    
    setTests(prev => ({ ...prev, tables: allExist ? 'success' : 'error' }))
    
    if (!allExist) {
      addMessage('Execute o schema.sql no SQL Editor do Supabase', 'error')
    }

    // Teste 3: Realtime
    addMessage('Testando Realtime...')
    try {
      const channel = supabase
        .channel('test-connection')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'estado_atual'
        }, () => {
          addMessage('Realtime funcionando!', 'success')
        })
        .subscribe()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      channel.unsubscribe()
      setTests(prev => ({ ...prev, realtime: 'success' }))
      addMessage('Realtime habilitado', 'success')
    } catch (error: any) {
      setTests(prev => ({ ...prev, realtime: 'error' }))
      addMessage('Realtime pode não estar habilitado. Vá em Database → Replication', 'error')
    }

    // Teste 4: Leitura
    addMessage('Testando leitura...')
    try {
      const { data, error } = await supabase
        .from('estado_atual')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (data) {
        addMessage('Leitura funcionando!', 'success')
        addMessage(`Estado atual: ${JSON.stringify(data)}`, 'info')
      } else {
        addMessage('Tabela estado_atual vazia (normal se acabou de criar)', 'info')
      }
      
      setTests(prev => ({ ...prev, write: 'success' }))
    } catch (error: any) {
      setTests(prev => ({ ...prev, write: 'error' }))
      addMessage(`Erro na leitura: ${error.message}`, 'error')
    }

    setLoading(false)
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    if (status === 'pending') return <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const allSuccess = Object.values(tests).every(t => t === 'success')

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Database className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Teste de Conexão - Supabase</h1>
              <p className="text-slate-400">Verificando conexão com o banco de dados</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.connection)}
                <span className="text-white font-medium">Conexão Básica</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.tables)}
                <span className="text-white font-medium">Tabelas do Banco</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.realtime)}
                <span className="text-white font-medium">Realtime</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.write)}
                <span className="text-white font-medium">Leitura/Escrita</span>
              </div>
            </div>
          </div>

          {allSuccess && !loading && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-emerald-400 mb-2">🎉 Tudo Funcionando!</h2>
              <p className="text-slate-300">A conexão com o Supabase está perfeita!</p>
            </div>
          )}

          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Log de Testes</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm text-slate-300 font-mono">
                  {msg}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={runTests}
              disabled={loading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? 'Testando...' : 'Executar Testes Novamente'}
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
            >
              Voltar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

