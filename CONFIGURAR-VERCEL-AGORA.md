# ⚠️ ERRO: Configure as Variáveis de Ambiente na Vercel

## 🔴 Problema Atual

O erro `ERR_NAME_NOT_RESOLVED` para `placeholder.supabase.co` significa que as **variáveis de ambiente não estão configuradas na Vercel**.

## ✅ SOLUÇÃO RÁPIDA

### 1. Acesse a Vercel

1. Vá em: https://vercel.com/dashboard
2. Clique no seu projeto: **comite**

### 2. Configure as Variáveis de Ambiente

1. Vá em **Settings** → **Environment Variables**
2. Clique em **"Add New"**

**Adicione a primeira variável:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://kitbnraekovsnszoxhcb.supabase.co`
- Marque: ✅ Production, ✅ Preview, ✅ Development
- Clique em **"Save"**

**Adicione a segunda variável:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN`
- Marque: ✅ Production, ✅ Preview, ✅ Development
- Clique em **"Save"**

### 3. Faça um Novo Deploy

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o build (2-3 minutos)

## ✅ Verificação

Após o redeploy:

1. Acesse a URL da Vercel
2. Abra o Console do navegador (F12)
3. Deve aparecer: `✅ Supabase configurado: https://kitbnraekovsnszoxhcb.supabase.co`
4. Teste cadastrar um imóvel novamente

## 📋 Variáveis Necessárias

```
NEXT_PUBLIC_SUPABASE_URL=https://kitbnraekovsnszoxhcb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN
```

## 🎯 Resumo

1. ✅ Vercel → Settings → Environment Variables
2. ✅ Adicione as 2 variáveis acima
3. ✅ Marque para todos os ambientes
4. ✅ Redeploy
5. ✅ Pronto!

