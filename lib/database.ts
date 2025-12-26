import { supabase, supabaseConfigured, type Imovel, type Avaliacao, type Sessao, type EstadoAtual } from './supabase'

// ==================== IMÓVEIS ====================

export async function cadastrarImovel(nome: string, tipo: string) {
  if (!supabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.')
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
  const { data: estado } = await supabase
    .from('estado_atual')
    .select('imovel_ativo_id')
    .single()

  if (!estado?.imovel_ativo_id) {
    throw new Error('Nenhum imóvel cadastrado')
  }

  // Limpar avaliações anteriores deste imóvel
  await supabase
    .from('avaliacoes')
    .delete()
    .eq('imovel_id', estado.imovel_ativo_id)

  // Ativar avaliação
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
    .select('imovel_ativo_id')
    .single()

  if (!estado?.imovel_ativo_id) {
    throw new Error('Nenhum imóvel em avaliação')
  }

  // Obter imóvel e avaliações
  const { data: imovel } = await supabase
    .from('imoveis')
    .select('*')
    .eq('id', estado.imovel_ativo_id)
    .single()

  const avaliacoes = await obterAvaliacoes(estado.imovel_ativo_id)

  // Calcular média
  const media = avaliacoes.length > 0
    ? avaliacoes.reduce((sum, av) => sum + Number(av.valor), 0) / avaliacoes.length
    : 0

  // Salvar na sessão
  const { data: sessao } = await supabase
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
  return supabase
    .channel(`avaliacoes_${imovelId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'avaliacoes',
        filter: `imovel_id=eq.${imovelId}`
      },
      (payload) => {
        callback(payload.new as Avaliacao)
      }
    )
    .subscribe()
}

