import { NextRequest, NextResponse } from 'next/server'
import { enviarAvaliacao, obterAvaliacoes } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return NextResponse.json({ 
        error: 'Supabase não configurado. Configure as variáveis de ambiente.' 
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const imovelId = searchParams.get('imovel_id')
    
    if (!imovelId) {
      return NextResponse.json({ error: 'imovel_id é obrigatório' }, { status: 400 })
    }

    const avaliacoes = await obterAvaliacoes(imovelId)
    return NextResponse.json(avaliacoes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return NextResponse.json({ 
        error: 'Supabase não configurado. Configure as variáveis de ambiente.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { imovel_id, corretor, valor } = body

    if (!imovel_id || !corretor || !valor) {
      return NextResponse.json(
        { error: 'imovel_id, corretor e valor são obrigatórios' },
        { status: 400 }
      )
    }

    const avaliacao = await enviarAvaliacao(imovel_id, corretor, valor)
    return NextResponse.json(avaliacao)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

