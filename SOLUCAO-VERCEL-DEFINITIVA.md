# 🚨 SOLUÇÃO DEFINITIVA - Erro na Vercel

## ⚠️ O Problema

O erro `ERR_NAME_NOT_RESOLVED` para `placeholder.supabase.co` significa que as variáveis de ambiente **NÃO estão configuradas na Vercel**.

**IMPORTANTE**: As variáveis de ambiente **NÃO devem estar no Git** (por segurança). Elas **DEVEM estar configuradas na Vercel**.

## ✅ SOLUÇÃO - Configure AGORA na Vercel

### Passo 1: Acesse a Vercel

1. Vá em: **https://vercel.com/dashboard**
2. Faça login
3. Clique no projeto: **comite** ou **comite-nine**

### Passo 2: Vá em Environment Variables

1. Clique em **"Settings"** (no topo)
2. No menu lateral, clique em **"Environment Variables"**

### Passo 3: Adicione as Variáveis

**Variável 1:**
- Clique em **"Add New"**
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://kitbnraekovsnszoxhcb.supabase.co`
- Marque: ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Clique em **"Save"**

**Variável 2:**
- Clique em **"Add New"** novamente
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN`
- Marque: ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Clique em **"Save"**

### Passo 4: FAÇA UM REDEPLOY (OBRIGATÓRIO!)

**⚠️ CRÍTICO**: Após adicionar as variáveis, você **DEVE** fazer um redeploy!

1. Vá em **"Deployments"** (menu superior)
2. Encontre o último deploy
3. Clique nos **3 pontinhos** (⋯) à direita
4. Clique em **"Redeploy"**
5. Confirme
6. Aguarde 2-3 minutos

## 🔍 Verificação

Após o redeploy, abra o Console do navegador (F12) e verifique:

**✅ Deve aparecer:**
```
✅ Supabase configurado: https://kitbnraekovsnszoxhcb...
```

**❌ NÃO deve aparecer:**
```
❌ ERRO CRÍTICO: Supabase não configurado!
```

## 📋 Valores Exatos

Copie e cole EXATAMENTE assim:

**Variável 1:**
```
NEXT_PUBLIC_SUPABASE_URL
https://kitbnraekovsnszoxhcb.supabase.co
```

**Variável 2:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN
```

## ⚠️ Por Que Precisa de Redeploy?

As variáveis `NEXT_PUBLIC_*` são injetadas **durante o build**. Se você adicionar as variáveis mas não fizer redeploy, o código ainda terá os valores antigos (placeholder).

## 🎯 Checklist Rápido

- [ ] Acessei Vercel → Settings → Environment Variables
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_URL` com o valor correto
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_ANON_KEY` com o valor correto
- [ ] Marquei para Production, Preview e Development
- [ ] **FIZ UM REDEPLOY** ← MUITO IMPORTANTE!
- [ ] Aguardei o build terminar
- [ ] Testei e funcionou!

## 🆘 Ainda Não Funciona?

1. **Verifique se as variáveis estão na lista** (Settings → Environment Variables)
2. **Verifique se fez o Redeploy** (Deployments → 3 pontinhos → Redeploy)
3. **Aguarde alguns minutos** após o redeploy
4. **Limpe o cache do navegador** (Ctrl+Shift+R)
5. **Verifique o Console** (F12) para ver a mensagem de erro

## 💡 Dica

Se você já configurou mas ainda não funciona, provavelmente esqueceu de fazer o **Redeploy**. As variáveis só são aplicadas em novos builds!

