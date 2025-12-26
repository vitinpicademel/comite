-- Migration: Adiciona sistema de fila de imóveis pendentes
-- Execute este SQL no SQL Editor do Supabase

-- Adicionar coluna status na tabela imoveis
ALTER TABLE imoveis 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' 
CHECK (status IN ('pendente', 'votando', 'finalizado'));

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_imoveis_status ON imoveis(status);

-- Atualizar imóveis existentes para 'finalizado' se já foram avaliados
UPDATE imoveis 
SET status = 'finalizado'
WHERE id IN (SELECT DISTINCT imovel_id FROM sessoes WHERE imovel_id IS NOT NULL);

-- Atualizar imóvel ativo (se existir) para 'votando'
UPDATE imoveis 
SET status = 'votando'
WHERE id IN (SELECT imovel_ativo_id FROM estado_atual WHERE imovel_ativo_id IS NOT NULL AND avaliacao_ativa = true);

-- Os demais ficam como 'pendente' (padrão)

