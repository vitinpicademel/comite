# 🚀 Configuração para Vercel - Produção

## ✅ Sistema Configurado para Vercel

O sistema agora funciona **100% com Supabase** em produção, sem necessidade de Socket.IO!

## 📋 Passo a Passo para Deploy na Vercel

### 1. Conectar Repositório

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Conecte o repositório: `vitinpicademel/comite`
5. Clique em **"Import"**

### 2. Configurar Variáveis de Ambiente

Na página de configuração do projeto, adicione estas variáveis:

**Settings → Environment Variables**

Adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://kitbnraekovsnszoxhcb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN
```

**⚠️ IMPORTANTE:**
- Marque para **Production**, **Preview** e **Development**
- Clique em **"Save"**

### 3. Configurar Build

O Vercel detecta automaticamente Next.js, mas verifique:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Pronto! 🎉

## 🔧 Configurações Importantes

### Variáveis de Ambiente na Vercel

Você **DEVE** configurar na Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Marque para todos os ambientes
4. **NÃO** adicione `NEXT_PUBLIC_SOCKET_URL` (não é necessário)

### Build Settings

O Vercel detecta automaticamente, mas se precisar:

- **Node.js Version**: 18.x ou superior
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. Acesse a URL fornecida pela Vercel
2. O status deve mostrar: **"Conectado (Supabase)"**
3. Teste cadastrar um imóvel
4. Teste enviar uma avaliação

## 🎯 Funcionalidades em Produção

- ✅ Funciona 100% com Supabase
- ✅ Não precisa de servidor Socket.IO
- ✅ Realtime automático
- ✅ Persistência de dados
- ✅ Funciona de qualquer lugar

## 🔒 Segurança

- As variáveis de ambiente são seguras na Vercel
- A chave `anon` é pública e segura para frontend
- Dados salvos no Supabase

## 📝 Notas

- **Socket.IO não é necessário** em produção
- O sistema detecta automaticamente se está em produção
- Usa Supabase sempre que possível
- Fallback para Socket.IO apenas em desenvolvimento local

## 🆘 Problemas Comuns

### Erro: "Supabase não configurado"
→ Verifique se as variáveis de ambiente estão configuradas na Vercel

### Erro: "Cannot connect to database"
→ Verifique se o Supabase está ativo e as credenciais estão corretas

### Build falha
→ Verifique se todas as dependências estão no `package.json`

## 🎉 Pronto!

Após configurar, seu sistema estará funcionando na Vercel com Supabase!

