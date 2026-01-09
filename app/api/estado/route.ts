import { NextRequest, NextResponse } from 'next/server'
import { obterEstadoAtual, definirImovelAtivo, iniciarAvaliacao, finalizarAvaliacao } from '@/lib/database'

export async function GET() {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return NextResponse.json({ 
        error: 'Supabase não configurado. Configure as variáveis de ambiente.' 
      }, { status: 503 })
    }
    
    const estado = await obterEstadoAtual()
    return NextResponse.json(estado)
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
    const { action, ...data } = body

    switch (action) {
      case 'definir_imovel':
        const estado1 = await definirImovelAtivo(data.imovelId)
        return NextResponse.json(estado1)

      case 'iniciar_avaliacao':
        const estado2 = await iniciarAvaliacao()
        return NextResponse.json(estado2)

      case 'finalizar_avaliacao':
        const resultado = await finalizarAvaliacao()
        return NextResponse.json(resultado)

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

