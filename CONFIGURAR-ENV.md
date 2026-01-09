# 🔑 Configuração do .env.local - Supabase

## ✅ Qual Chave Usar?

Baseado na nova interface do Supabase, você precisa de:

### 1. **Project URL**
- Onde encontrar: Settings → API → Project URL (geralmente no topo da página)
- Formato: `https://xxxxx.supabase.co`

### 2. **Publishable Key** (NÃO a Secret Key!)
- A que você vê na tela: `sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseH...`
- Esta é a chave pública, segura para usar no frontend
- **COPIE A CHAVE COMPLETA** (clique no ícone de copiar)

## ⚙️ Configuração no .env.local

Abra o arquivo `.env.local` e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseH...
```

**⚠️ IMPORTANTE:**
- Use a **Publishable key** (não a Secret key!)
- A Secret key é apenas para backend/servidor
- Copie a chave COMPLETA (ela é longa)

## 📍 Onde Encontrar a Project URL?

Se não estiver visível na mesma tela:
1. Vá em **Settings** → **API**
2. Procure por **"Project URL"** ou **"API URL"**
3. Deve estar no formato: `https://xxxxx.supabase.co`

## ✅ Exemplo Completo

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wqzffnpgmytwodbkkyxew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHabcdefghijklmnopqrstuvwxyz1234567890
```

## 🔒 Segurança

- ✅ **Publishable key**: Segura para usar no frontend (já está no nome!)
- ❌ **Secret key**: NUNCA use no frontend, apenas em servidores seguros

## 🎯 Resumo

1. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
2. **Publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **NÃO use** a Secret key no `.env.local`!

