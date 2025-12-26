# 🗄️ Configuração do Supabase - Banco de Dados Gratuito

## 📋 Passo a Passo para Configurar

### 1️⃣ Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"** ou **"Sign Up"**
3. Faça login com GitHub, Google ou email
4. É **100% gratuito** até 500MB de banco e 2GB de bandwidth

### 2️⃣ Criar um Novo Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Name**: `comite-imobiliario` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a mais próxima (ex: `South America (São Paulo)`)
3. Aguarde 2-3 minutos para o projeto ser criado

### 3️⃣ Obter as Chaves de API

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Você verá:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (chave longa)

### 4️⃣ Configurar Variáveis de Ambiente

1. No seu projeto, edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Substitua** `xxxxx` pelos valores reais do seu projeto!

### 5️⃣ Criar as Tabelas no Banco

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Copie e cole TODO o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **"Run"** (ou F5)
5. Você deve ver: ✅ "Success. No rows returned"

### 6️⃣ Habilitar Realtime (Importante!)

1. No Supabase, vá em **Database** → **Replication**
2. Para cada tabela (`imoveis`, `avaliacoes`, `sessoes`, `estado_atual`):
   - Clique no toggle para **ativar Realtime**
   - Ou execute no SQL Editor:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE nome_da_tabela;
   ```

### 7️⃣ Testar a Conexão

1. Instale as dependências:
```bash
npm install
```

2. Reinicie o servidor Next.js:
```bash
npm run dev
```

3. Acesse a aplicação e verifique se conecta!

## ✅ Verificação

Para verificar se está funcionando:

1. No Supabase, vá em **Table Editor**
2. Você deve ver as tabelas: `imoveis`, `avaliacoes`, `sessoes`, `estado_atual`
3. A tabela `estado_atual` deve ter 1 linha com `id = 1`

## 🔒 Segurança

- A chave `anon` é pública e segura para usar no frontend
- O Supabase usa Row Level Security (RLS) - você pode configurar depois
- Para produção, configure políticas de segurança no Supabase

## 📊 Limites Gratuitos

- ✅ **500MB** de banco de dados
- ✅ **2GB** de bandwidth por mês
- ✅ **500MB** de armazenamento de arquivos
- ✅ **2 milhões** de requisições por mês
- ✅ Realtime ilimitado

**Isso é mais que suficiente para o seu projeto!**

## 🆘 Problemas Comuns

### Erro: "Invalid API key"
- Verifique se copiou a chave completa (é muito longa!)
- Certifique-se de que não há espaços extras

### Erro: "relation does not exist"
- Execute o schema.sql novamente
- Verifique se todas as tabelas foram criadas

### Realtime não funciona
- Verifique se habilitou Realtime nas tabelas
- Verifique se o projeto está ativo no Supabase

## 🎉 Pronto!

Agora seu sistema está usando um banco de dados real com persistência e tempo real!

