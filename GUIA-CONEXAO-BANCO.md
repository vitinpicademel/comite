# 🔌 Guia Completo: Como Conectar ao Banco de Dados

## 📋 Visão Geral

O sistema usa **Supabase** (PostgreSQL gratuito) para armazenar todos os dados. A conexão é feita através de variáveis de ambiente e o código já está pronto!

## 🚀 Passo a Passo Completo

### **PASSO 1: Criar Conta no Supabase** (5 minutos)

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** ou **"Sign Up"**
3. Escolha uma forma de login:
   - GitHub (recomendado)
   - Google
   - Email
4. É **100% gratuito** até 500MB de banco!

### **PASSO 2: Criar Novo Projeto** (3 minutos)

1. No dashboard, clique em **"New Project"**
2. Preencha os dados:
   ```
   Organization: (selecione ou crie uma)
   Name: comite-imobiliario
   Database Password: [Crie uma senha forte - ANOTE ELA!]
   Region: South America (São Paulo) [ou mais próxima]
   ```
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos (o Supabase está criando seu banco)

### **PASSO 3: Obter Credenciais** (2 minutos)

1. No dashboard do Supabase, clique em **⚙️ Settings** (canto inferior esquerdo)
2. Clique em **API**
3. Você verá duas informações importantes:

   **📌 Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **📌 anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxMjM0NTY3LCJleHAiOjE5NTY4MTA1Njd9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **COPIE AMBAS AS INFORMAÇÕES!** Você vai precisar delas.

### **PASSO 4: Configurar Variáveis de Ambiente** (2 minutos)

1. No seu projeto, abra o arquivo `.env.local`
2. Adicione ou edite as linhas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:**
- Substitua pelos valores REAIS que você copiou
- A chave anon é muito longa - copie ela COMPLETA
- Não deixe espaços extras

3. Salve o arquivo

### **PASSO 5: Criar as Tabelas no Banco** (5 minutos)

1. No Supabase, clique em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `supabase/schema.sql` do seu projeto
4. **Copie TODO o conteúdo** do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione F5)
7. Você deve ver: ✅ **"Success. No rows returned"**

### **PASSO 6: Habilitar Realtime** (2 minutos)

1. No Supabase, clique em **Database** → **Replication**
2. Para cada uma dessas tabelas, ative o toggle:
   - ✅ `imoveis`
   - ✅ `avaliacoes`
   - ✅ `sessoes`
   - ✅ `estado_atual`

**OU** execute no SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE imoveis;
ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE sessoes;
ALTER PUBLICATION supabase_realtime ADD TABLE estado_atual;
```

### **PASSO 7: Verificar Conexão** (1 minuto)

1. Reinicie o servidor Next.js:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente:
   npm run dev
   ```

2. Abra o navegador em `http://localhost:3000`

3. Se tudo estiver OK:
   - ✅ O status deve mostrar "Conectado" (verde)
   - ✅ Não deve aparecer erros no console
   - ✅ Você pode cadastrar imóveis normalmente

## 🔍 Como Verificar se Está Funcionando

### Verificação 1: Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. **NÃO deve aparecer:** "⚠️ Variáveis de ambiente do Supabase não configuradas!"

### Verificação 2: Supabase Dashboard

1. No Supabase, vá em **Table Editor**
2. Você deve ver as tabelas:
   - `imoveis`
   - `avaliacoes`
   - `sessoes`
   - `estado_atual`
3. A tabela `estado_atual` deve ter 1 linha com `id = 1`

### Verificação 3: Teste Prático

1. No painel CEO, cadastre um imóvel
2. Vá no Supabase → **Table Editor** → `imoveis`
3. Você deve ver o imóvel cadastrado aparecendo lá!

## 🛠️ Estrutura da Conexão

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend)     │
└────────┬────────┘
         │
         │ Variáveis de Ambiente
         │ NEXT_PUBLIC_SUPABASE_URL
         │ NEXT_PUBLIC_SUPABASE_ANON_KEY
         │
         ▼
┌─────────────────┐
│  lib/supabase.ts│  ← Cliente Supabase
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────┐
│   Supabase      │
│  (PostgreSQL)   │  ← Banco de Dados na Nuvem
└─────────────────┘
```

## 📝 Arquivos Envolvidos

- **`.env.local`** - Credenciais (NÃO commitar no Git!)
- **`lib/supabase.ts`** - Cliente de conexão
- **`lib/database.ts`** - Funções que usam o banco
- **`supabase/schema.sql`** - Estrutura das tabelas

## ⚠️ Problemas Comuns

### Erro: "Invalid API key"
**Solução:** Verifique se copiou a chave completa (é muito longa!)

### Erro: "relation does not exist"
**Solução:** Execute o `schema.sql` novamente no SQL Editor

### Erro: "supabaseUrl is required"
**Solução:** Verifique se o `.env.local` está correto e reinicie o servidor

### Realtime não funciona
**Solução:** Verifique se habilitou Realtime nas tabelas (PASSO 6)

## 🎯 Resumo Rápido

1. ✅ Criar conta no Supabase
2. ✅ Criar projeto
3. ✅ Copiar URL e chave anon
4. ✅ Colar no `.env.local`
5. ✅ Executar `schema.sql`
6. ✅ Habilitar Realtime
7. ✅ Pronto! 🎉

## 💡 Dica

Depois de configurar, você pode ver todos os dados em tempo real no dashboard do Supabase! É como ter um "phpMyAdmin" na nuvem.

