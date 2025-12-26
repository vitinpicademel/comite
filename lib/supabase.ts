import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Criar cliente apenas se as variáveis estiverem configuradas
let supabase: SupabaseClient

if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  // Criar cliente dummy para build
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas!')
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
}

export { supabase }

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

