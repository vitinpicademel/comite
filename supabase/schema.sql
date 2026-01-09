-- Schema do banco de dados para Comitê Avaliativo Imobiliário
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Casa', 'Apartamento', 'Terreno', 'Chácara', 'Rancho', 'Sítio', 'Galpão')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  corretor TEXT NOT NULL,
  valor DECIMAL(12, 2) NOT NULL CHECK (valor > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Sessões (Histórico de avaliações finalizadas)
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE SET NULL,
  nome_imovel TEXT NOT NULL,
  tipo_imovel TEXT NOT NULL,
  media_final DECIMAL(12, 2) NOT NULL,
  data_avaliacao DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Estado Atual (para controle de sessão ativa)
CREATE TABLE IF NOT EXISTS estado_atual (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  imovel_ativo_id UUID REFERENCES imoveis(id) ON DELETE SET NULL,
  avaliacao_ativa BOOLEAN DEFAULT FALSE,
  contador_dia INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Inserir estado inicial
INSERT INTO estado_atual (id, imovel_ativo_id, avaliacao_ativa, contador_dia)
VALUES (1, NULL, FALSE, 0)
ON CONFLICT (id) DO NOTHING;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_imovel ON avaliacoes(imovel_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_corretor ON avaliacoes(corretor);
CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data_avaliacao);
CREATE INDEX IF NOT EXISTS idx_sessoes_imovel ON sessoes(imovel_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_imoveis_updated_at
  BEFORE UPDATE ON imoveis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estado_atual_updated_at
  BEFORE UPDATE ON estado_atual
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para resetar contador diário (executar via cron job ou manualmente)
CREATE OR REPLACE FUNCTION resetar_contador_diario()
RETURNS void AS $$
BEGIN
  UPDATE estado_atual
  SET contador_dia = 0, updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- View para estatísticas do dia
CREATE OR REPLACE VIEW estatisticas_dia AS
SELECT 
  COUNT(DISTINCT s.id) as imoveis_avaliados,
  AVG(s.media_final) as media_geral,
  SUM(s.media_final) as total_avaliado
FROM sessoes s
WHERE s.data_avaliacao = CURRENT_DATE;

-- Habilitar Realtime para as tabelas principais
ALTER PUBLICATION supabase_realtime ADD TABLE imoveis;
ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE sessoes;
ALTER PUBLICATION supabase_realtime ADD TABLE estado_atual;

