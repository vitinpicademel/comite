# ⚡ Configuração Rápida - Supabase

## 🔑 Credenciais Necessárias

Para conectar a aplicação ao Supabase, você precisa de **2 informações**:

### 1. Project URL
### 2. anon public key

**⚠️ NÃO é a senha do banco!** São credenciais diferentes.

## 📍 Onde Encontrar

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Clique no seu projeto
3. Vá em **⚙️ Settings** (canto inferior esquerdo)
4. Clique em **API**
5. Você verá:

```
Project URL
https://xxxxxxxxxxxxx.supabase.co
↑ COPIE ISSO

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
↑ COPIE ISSO TAMBÉM (é uma chave muito longa!)
```

## ⚙️ Configurar no Projeto

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione ou edite:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Substitua** pelos valores reais que você copiou
4. Salve o arquivo

## ✅ Próximos Passos

Depois de configurar as variáveis:

1. Execute o SQL: Abra `supabase/schema.sql` e execute no SQL Editor do Supabase
2. Habilite Realtime: Database → Replication → Ative para todas as tabelas
3. Reinicie o servidor: `npm run dev`

## 🔒 Segurança

- A senha do banco (`3wd0ncay`) é usada apenas para acesso direto ao PostgreSQL
- Para a aplicação, usamos a **anon key** (mais segura)
- **NUNCA** commite o arquivo `.env.local` no Git (já está no .gitignore)

