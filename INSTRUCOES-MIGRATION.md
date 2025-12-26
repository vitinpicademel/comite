# 🔧 INSTRUÇÕES: Executar Migration da Fila de Imóveis

## ⚠️ ERRO ATUAL
O erro "Could not find the 'status' column of 'imoveis' in the schema cache" ocorre porque a coluna `status` ainda não foi adicionada ao banco de dados.

## ✅ SOLUÇÃO: Executar Migration

### Passo 1: Acessar o Supabase
1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto: `kitbnraekovsnszoxhcb`

### Passo 2: Abrir o SQL Editor
1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique no botão **"New query"** (Nova consulta)

### Passo 3: Executar a Migration
1. Abra o arquivo `supabase/migration-fila-imoveis.sql` no seu editor
2. **COPIE TODO O CONTEÚDO** do arquivo
3. **COLE** no SQL Editor do Supabase
4. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)

### Passo 4: Verificar
Após executar, você deve ver uma mensagem de sucesso. A coluna `status` foi adicionada à tabela `imoveis`.

### Passo 5: Testar
Volte para a aplicação e tente cadastrar um imóvel novamente. O erro deve desaparecer.

---

## 📋 Conteúdo da Migration

A migration faz o seguinte:
- Adiciona coluna `status` na tabela `imoveis` com valores: `pendente`, `votando`, `finalizado`
- Define valor padrão como `pendente`
- Cria índice para performance
- Atualiza imóveis existentes conforme estado atual

---

## 🆘 Se ainda der erro

1. Verifique se você está no projeto correto do Supabase
2. Certifique-se de que copiou TODO o conteúdo do arquivo SQL
3. Verifique se não há erros de sintaxe no SQL Editor
4. Tente executar novamente

