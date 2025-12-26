import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Ler variáveis de ambiente (funciona tanto no cliente quanto no servidor)
const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') {
    // No cliente, as variáveis NEXT_PUBLIC_* são injetadas no build
    return (window as any).__NEXT_DATA__?.env?.[key] || process.env[key] || ''
  }
  // No servidor
  return process.env[key] || ''
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Verificar se as variáveis estão configuradas corretamente
const isConfigured = supabaseUrl && 
                     supabaseAnonKey && 
                     supabaseUrl.trim() !== '' &&
                     supabaseAnonKey.trim() !== '' &&
                     !supabaseUrl.includes('placeholder') && 
                     !supabaseAnonKey.includes('placeholder') &&
                     supabaseUrl.includes('.supabase.co') &&
                     supabaseAnonKey.startsWith('sb_')

// Criar cliente Supabase
let supabase: SupabaseClient

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
  if (typeof window !== 'undefined') {
    console.log('✅ Supabase configurado:', supabaseUrl.substring(0, 30) + '...')
  }
} else {
  // Não criar cliente dummy - vai causar erro claro
  // Isso força a configuração correta
  if (typeof window !== 'undefined') {
    console.error('❌ ERRO CRÍTICO: Supabase não configurado!')
    console.error('URL:', supabaseUrl || 'NÃO DEFINIDO')
    console.error('Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NÃO DEFINIDO')
    console.error('')
    console.error('🔧 SOLUÇÃO:')
    console.error('1. Vá em Vercel → Settings → Environment Variables')
    console.error('2. Adicione NEXT_PUBLIC_SUPABASE_URL = https://kitbnraekovsnszoxhcb.supabase.co')
    console.error('3. Adicione NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN')
    console.error('4. Faça um Redeploy')
  }
  
  // Criar cliente que vai falhar de forma clara
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
}

export { supabase, isConfigured as supabaseConfigured }

// Tipos TypeScript para o banco
export interface Imovel {
  id: string
  nome: string
  tipo: 'Casa' | 'Apartamento' | 'Terreno' | 'Chácara' | 'Rancho' | 'Sítio' | 'Galpão'
  created_at: string
  updated_at: string
}

export interface Avaliacao {
  id: string
  imovel_id: string
  corretor: string
  valor: number
  created_at: string
  updated_at: string
}

export interface Sessao {
  id: string
  imovel_id: string | null
  nome_imovel: string
  tipo_imovel: string
  media_final: number
  data_avaliacao: string
  created_at: string
}

export interface EstadoAtual {
  id: number
  imovel_ativo_id: string | null
  avaliacao_ativa: boolean
  contador_dia: number
  updated_at: string
}

