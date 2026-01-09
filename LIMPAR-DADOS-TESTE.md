# 🗑️ Como Limpar Dados de Teste no Supabase

## 📍 Onde Acessar

1. **Acesse o Supabase:**
   - Vá para https://supabase.com
   - Faça login na sua conta
   - Selecione o projeto: `kitbnraekovsnszoxhcb`

2. **Abra o SQL Editor:**
   - No menu lateral esquerdo, clique em **"SQL Editor"**
   - Clique no botão **"New query"** (Nova consulta)

---

## 🧹 Scripts de Limpeza

### Opção 1: Limpar TUDO (Recomendado para testes)

Execute este SQL para apagar **TODOS** os registros de todas as tabelas:

```sql
-- Limpar TODOS os dados de teste
-- ⚠️ ATENÇÃO: Isso apaga TODOS os registros!

-- Limpar avaliações
DELETE FROM avaliacoes;

-- Limpar sessões (histórico)
DELETE FROM sessoes;

-- Limpar imóveis
DELETE FROM imoveis;

-- Resetar estado atual
UPDATE estado_atual 
SET 
  imovel_ativo_id = NULL,
  avaliacao_ativa = FALSE,
  contador_dia = 0,
  updated_at = NOW()
WHERE id = 1;

-- Mensagem de confirmação
SELECT 'Todos os dados foram limpos com sucesso!' as resultado;
```

---

### Opção 2: Limpar Apenas Dados Específicos

#### Limpar apenas imóveis de teste (mantém histórico):
```sql
-- Apagar apenas imóveis pendentes ou de teste
DELETE FROM imoveis 
WHERE status = 'pendente' OR status = 'votando';

-- Resetar estado
UPDATE estado_atual 
SET imovel_ativo_id = NULL, avaliacao_ativa = FALSE 
WHERE id = 1;
```

#### Limpar apenas avaliações (mantém imóveis e histórico):
```sql
DELETE FROM avaliacoes;
```

#### Limpar apenas histórico (mantém imóveis e avaliações ativas):
```sql
DELETE FROM sessoes;
```

---

### Opção 3: Limpar e Resetar Contador do Dia

```sql
-- Limpar tudo e resetar contador
DELETE FROM avaliacoes;
DELETE FROM sessoes;
DELETE FROM imoveis;

UPDATE estado_atual 
SET 
  imovel_ativo_id = NULL,
  avaliacao_ativa = FALSE,
  contador_dia = 0,
  updated_at = NOW()
WHERE id = 1;

SELECT 'Banco de dados resetado completamente!' as resultado;
```

---

## 🔍 Verificar o que será apagado (ANTES de apagar)

Execute estes comandos para ver quantos registros existem:

```sql
-- Ver quantidade de registros em cada tabela
SELECT 
  (SELECT COUNT(*) FROM imoveis) as total_imoveis,
  (SELECT COUNT(*) FROM avaliacoes) as total_avaliacoes,
  (SELECT COUNT(*) FROM sessoes) as total_sessoes,
  (SELECT contador_dia FROM estado_atual WHERE id = 1) as contador_dia;
```

---

## ⚠️ IMPORTANTE

- **Backup:** Se quiser manter algum dado, exporte antes de apagar
- **Produção:** Se este banco for usado em produção, tenha cuidado!
- **Ordem:** A ordem de DELETE importa devido às foreign keys:
  1. Primeiro: `avaliacoes` (depende de `imoveis`)
  2. Segundo: `sessoes` (depende de `imoveis`)
  3. Terceiro: `imoveis`
  4. Por último: Resetar `estado_atual`

---

## ✅ Após Limpar

1. Execute a migration novamente se necessário:
   - `supabase/migration-fila-imoveis.sql`
   
2. Teste cadastrando um novo imóvel para verificar se está tudo funcionando.

