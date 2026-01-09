# 🔧 Configurar Variáveis de Ambiente na Vercel - PASSO A PASSO

## ⚠️ ERRO ATUAL

O sistema está mostrando: "Supabase não configurado"

Isso significa que as variáveis de ambiente **NÃO estão configuradas na Vercel**.

## ✅ SOLUÇÃO - Passo a Passo Visual

### 1️⃣ Acesse o Dashboard da Vercel

1. Vá em: **https://vercel.com/dashboard**
2. Faça login (se necessário)
3. Clique no projeto: **comite** ou **comite-nine**

### 2️⃣ Vá em Settings

1. No menu superior, clique em **"Settings"**
2. No menu lateral esquerdo, clique em **"Environment Variables"**

### 3️⃣ Adicione a Primeira Variável

1. Clique no botão **"Add New"** (ou **"Add"**)
2. Preencha:
   - **Key (Name)**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://kitbnraekovsnszoxhcb.supabase.co`
3. **IMPORTANTE**: Marque as 3 opções:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development**
4. Clique em **"Save"**

### 4️⃣ Adicione a Segunda Variável

1. Clique em **"Add New"** novamente
2. Preencha:
   - **Key (Name)**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN`
3. **IMPORTANTE**: Marque as 3 opções:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
4. Clique em **"Save"**

### 5️⃣ Verifique se Estão Configuradas

Você deve ver na lista:

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 6️⃣ Faça um Redeploy

**IMPORTANTE**: Após adicionar as variáveis, você **DEVE** fazer um redeploy!

1. Vá em **"Deployments"** (menu superior)
2. Encontre o último deploy
3. Clique nos **3 pontinhos** (⋯) à direita
4. Clique em **"Redeploy"**
5. Confirme clicando em **"Redeploy"** novamente
6. Aguarde 2-3 minutos

## ✅ Verificação

Após o redeploy:

1. Acesse a URL da Vercel (ex: `comite-nine.vercel.app`)
2. Abra o Console do navegador (F12 → Console)
3. Deve aparecer: `✅ Supabase configurado: https://kitbnraekovsnszoxhcb...`
4. **NÃO** deve aparecer: `❌ ERRO CRÍTICO: Supabase não configurado!`
5. Teste cadastrar um imóvel - deve funcionar!

## 📋 Valores Exatos para Copiar

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

## ⚠️ Erros Comuns

### Erro: "Variável não encontrada"
→ Verifique se copiou o nome EXATO (com NEXT_PUBLIC_ no início)

### Erro: "Ainda mostra placeholder"
→ Você precisa fazer um **Redeploy** após adicionar as variáveis!

### Erro: "Funciona no localhost mas não na Vercel"
→ As variáveis de ambiente são diferentes para cada ambiente. Configure na Vercel!

## 🎯 Checklist

- [ ] Acessei Vercel → Settings → Environment Variables
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Marquei para Production, Preview e Development
- [ ] Fiz um Redeploy
- [ ] Testei e funcionou!

## 🆘 Ainda Não Funciona?

1. Verifique se as variáveis estão na lista (Settings → Environment Variables)
2. Verifique se fez o Redeploy
3. Verifique o Console do navegador para ver a mensagem de erro
4. Aguarde alguns minutos após o redeploy (pode levar tempo para propagar)

