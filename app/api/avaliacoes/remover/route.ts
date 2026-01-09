import { NextRequest, NextResponse } from 'next/server'
import { removerAvaliacaoCorretor } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return NextResponse.json({ 
        error: 'Supabase não configurado. Configure as variáveis de ambiente.' 
      }, { status: 503 })
    }

    // Suportar tanto JSON quanto Blob (sendBeacon)
    let body: any
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      body = await request.json()
    } else {
      // sendBeacon envia como Blob, precisamos ler como texto
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { imovel_id, corretor } = body

    if (!imovel_id || !corretor) {
      return NextResponse.json(
        { error: 'imovel_id e corretor são obrigatórios' },
        { status: 400 }
      )
    }

    await removerAvaliacaoCorretor(imovel_id, corretor)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
