import { supabase, supabaseConfigured, type Imovel, type Avaliacao, type Sessao, type EstadoAtual } from './supabase'

// ==================== IMÓVEIS ====================

export async function cadastrarImovel(nome: string, tipo: string) {
  if (!supabaseConfigured) {
    const errorMsg = 'Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel. Veja: CONFIGURAR-VERCEL-AGORA.md'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const { data, error } = await supabase
    .from('imoveis')
    .insert({ nome, tipo })
    .select()
    .single()

  if (error) {
    console.error('Erro ao cadastrar imóvel:', error)
    throw error
  }
  return data as Imovel
}

export async function obterImovelAtivo() {
  const { data: estado } = await supabase
    .from('estado_atual')
    .select('imovel_ativo_id')
    .single()

  if (!estado?.imovel_ativo_id) return null

  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('id', estado.imovel_ativo_id)
    .single()

  if (error) throw error
  return data as Imovel
}

// ==================== AVALIAÇÕES ====================

export async function enviarAvaliacao(imovelId: string, corretor: string, valor: number) {
  // Verificar se já existe avaliação deste corretor para este imóvel
  const { data: existente } = await supabase
    .from('avaliacoes')
    .select('id')
    .eq('imovel_id', imovelId)
    .eq('corretor', corretor)
    .single()

  if (existente) {
    // Atualizar avaliação existente
    const { data, error } = await supabase
      .from('avaliacoes')
      .update({ valor, updated_at: new Date().toISOString() })
      .eq('id', existente.id)
      .select()
      .single()

    if (error) throw error
    return data as Avaliacao
  } else {
    // Criar nova avaliação
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert({ imovel_id: imovelId, corretor, valor })
      .select()
      .single()

    if (error) throw error
    return data as Avaliacao
  }
}

export async function obterAvaliacoes(imovelId: string) {
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('*')
    .eq('imovel_id', imovelId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Avaliacao[]
}

// ==================== ESTADO ATUAL ====================

export async function obterEstadoAtual() {
  const { data, error } = await supabase
    .from('estado_atual')
    .select('*')
    .single()

  if (error) throw error
  return data as EstadoAtual
}

export async function definirImovelAtivo(imovelId: string | null) {
  const { data, error } = await supabase
    .from('estado_atual')
    .update({ 
      imovel_ativo_id: imovelId,
      avaliacao_ativa: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data as EstadoAtual
}

export async function iniciarAvaliacao() {
  // TRAVA DE SEGURANÇA: Verificar se já existe avaliação ativa
  const { data: estadoAtual } = await supabase
    .from('estado_atual')
    .select('*')
    .single()

  if (!estadoAtual?.imovel_ativo_id) {
    throw new Error('Nenhum imóvel cadastrado')
  }

  // Se já existe avaliação ativa, encerrar automaticamente antes de iniciar nova
  if (estadoAtual.avaliacao_ativa && estadoAtual.imovel_ativo_id) {
    console.log('⚠️ Avaliação ativa detectada. Encerrando automaticamente antes de iniciar nova...')
    
    // Finalizar avaliação anterior automaticamente
    const avaliacoesAnteriores = await obterAvaliacoes(estadoAtual.imovel_ativo_id)
    const mediaAnterior = avaliacoesAnteriores.length > 0
      ? avaliacoesAnteriores.reduce((sum, av) => sum + Number(av.valor), 0) / avaliacoesAnteriores.length
      : 0

    // Salvar sessão anterior
    const { data: imovelAnterior } = await supabase
      .from('imoveis')
      .select('*')
      .eq('id', estadoAtual.imovel_ativo_id)
      .single()

    if (imovelAnterior) {
      await supabase
        .from('sessoes')
        .insert({
          imovel_id: estadoAtual.imovel_ativo_id,
          nome_imovel: imovelAnterior.nome,
          tipo_imovel: imovelAnterior.tipo,
          media_final: mediaAnterior,
          data_avaliacao: new Date().toISOString().split('T')[0]
        })
    }

    // Limpar avaliações anteriores
    await supabase
      .from('avaliacoes')
      .delete()
      .eq('imovel_id', estadoAtual.imovel_ativo_id)
  }

  // Limpar avaliações do novo imóvel (se for diferente)
  if (estadoAtual.imovel_ativo_id) {
    await supabase
      .from('avaliacoes')
      .delete()
      .eq('imovel_id', estadoAtual.imovel_ativo_id)
  }

  // Ativar avaliação para o imóvel atual
  const { data, error } = await supabase
    .from('estado_atual')
    .update({ 
      avaliacao_ativa: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data as EstadoAtual
}

export async function finalizarAvaliacao() {
  const { data: estado } = await supabase
    .from('estado_atual')
    .select('imovel_ativo_id, avaliacao_ativa')
    .single()

  if (!estado?.imovel_ativo_id) {
    throw new Error('Nenhum imóvel em avaliação')
  }

  if (!estado.avaliacao_ativa) {
    throw new Error('Nenhuma avaliação ativa no momento')
  }

  // Obter imóvel e avaliações - FILTRADO por imovel_id
  const { data: imovel, error: imovelError } = await supabase
    .from('imoveis')
    .select('*')
    .eq('id', estado.imovel_ativo_id)
    .single()

  if (imovelError || !imovel) {
    throw new Error(`Imóvel não encontrado: ${imovelError?.message || 'Dados não disponíveis'}`)
  }

  // FILTRO OBRIGATÓRIO: Obter apenas avaliações deste imóvel específico
  const avaliacoes = await obterAvaliacoes(estado.imovel_ativo_id)

  // Calcular média
  const media = avaliacoes.length > 0
    ? avaliacoes.reduce((sum, av) => sum + Number(av.valor), 0) / avaliacoes.length
    : 0

  // Salvar na sessão
  const { data: sessao, error: sessaoError } = await supabase
    .from('sessoes')
    .insert({
      imovel_id: estado.imovel_ativo_id,
      nome_imovel: imovel.nome,
      tipo_imovel: imovel.tipo,
      media_final: media,
      data_avaliacao: new Date().toISOString().split('T')[0]
    })
    .select()
    .single()

  if (sessaoError) {
    throw new Error(`Erro ao salvar sessão: ${sessaoError.message}`)
  }

  // Obter estado atual para incrementar contador
  const { data: estadoAtual } = await supabase
    .from('estado_atual')
    .select('contador_dia')
    .single()

  const novoContador = (estadoAtual?.contador_dia || 0) + 1

  // Atualizar contador e limpar estado
  const { data: novoEstado } = await supabase
    .from('estado_atual')
    .update({
      imovel_ativo_id: null,
      avaliacao_ativa: false,
      contador_dia: novoContador,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single()

  return {
    sessao: sessao as Sessao,
    avaliacoes,
    media,
    estado: novoEstado as EstadoAtual
  }
}

// ==================== HISTÓRICO ====================

export async function obterHistorico(limite: number = 50) {
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limite)

  if (error) throw error
  return data as Sessao[]
}

export async function obterHistoricoDoDia() {
  const hoje = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .eq('data_avaliacao', hoje)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Sessao[]
}

// ==================== REALTIME SUBSCRIPTIONS ====================

export function subscribeEstadoAtual(callback: (estado: EstadoAtual) => void) {
  return supabase
    .channel('estado_atual_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'estado_atual',
        filter: 'id=eq.1'
      },
      (payload) => {
        callback(payload.new as EstadoAtual)
      }
    )
    .subscribe()
}

export function subscribeAvaliacoes(imovelId: string, callback: (avaliacao: Avaliacao) => void) {
  console.log('📡 Criando subscription para avaliações do imóvel:', imovelId)
  
  // Usar nome fixo para evitar múltiplas subscriptions
  const channelName = `avaliacoes_${imovelId}`
  
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT', // Apenas INSERT para novas avaliações
        schema: 'public',
        table: 'avaliacoes',
        filter: `imovel_id=eq.${imovelId}`
      },
      (payload) => {
        console.log('📨 Evento INSERT recebido:', payload)
        if (payload.new) {
          console.log('✅ Nova avaliação detectada:', payload.new)
          callback(payload.new as Avaliacao)
        }
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error('❌ Erro na subscription:', err)
      } else {
        console.log('📡 Status da subscription:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscription ativa e funcionando!')
        }
      }
    })
  
  return channel
}

