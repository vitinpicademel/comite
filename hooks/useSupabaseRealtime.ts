'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribeEstadoAtual, subscribeAvaliacoes } from '@/lib/database'
import type { EstadoAtual, Avaliacao, Imovel } from '@/lib/supabase'

export function useEstadoAtual() {
  const [estado, setEstado] = useState<EstadoAtual | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar estado inicial
    supabase
      .from('estado_atual')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setEstado(data as EstadoAtual)
        }
        setLoading(false)
      })

    // Subscribe para mudanças em tempo real
    const channel = subscribeEstadoAtual((novoEstado) => {
      setEstado(novoEstado)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { estado, loading }
}

export function useAvaliacoes(imovelId: string | null) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!imovelId) {
      setAvaliacoes([])
      setLoading(false)
      return
    }

    // Carregar avaliações iniciais
    supabase
      .from('avaliacoes')
      .select('*')
      .eq('imovel_id', imovelId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setAvaliacoes(data as Avaliacao[])
        }
        setLoading(false)
      })

    // Subscribe para mudanças em tempo real
    const channel = subscribeAvaliacoes(imovelId, (avaliacao) => {
      setAvaliacoes((prev) => {
        const index = prev.findIndex((av) => av.id === avaliacao.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = avaliacao
          return updated
        }
        return [...prev, avaliacao]
      })
    })

    return () => {
      channel.unsubscribe()
    }
  }, [imovelId])

  return { avaliacoes, loading }
}

export function useImovelAtivo() {
  const { estado } = useEstadoAtual()
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!estado?.imovel_ativo_id) {
      setImovel(null)
      setLoading(false)
      return
    }

    supabase
      .from('imoveis')
      .select('*')
      .eq('id', estado.imovel_ativo_id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setImovel(data as Imovel)
        }
        setLoading(false)
      })

    // Subscribe para mudanças no imóvel
    const channel = supabase
      .channel(`imovel_${estado.imovel_ativo_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'imoveis',
          filter: `id=eq.${estado.imovel_ativo_id}`
        },
        (payload) => {
          setImovel(payload.new as Imovel)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [estado?.imovel_ativo_id])

  return { imovel, loading }
}

