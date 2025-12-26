# 🔍 Como Encontrar a Project URL do Supabase

## 📍 Onde Está a Project URL?

A **Project URL** geralmente aparece em um destes lugares:

### Opção 1: Na mesma página de API Keys
- No topo da página **Settings → API**
- Procure por um campo chamado **"Project URL"** ou **"API URL"**
- Formato: `https://xxxxx.supabase.co`

### Opção 2: No Dashboard Principal
1. Vá para o **Dashboard** do seu projeto
2. No canto superior direito ou no menu lateral
3. Procure por **"Project Settings"** ou **"API Settings"**
4. A URL deve estar lá

### Opção 3: Na URL do Navegador
- Quando você está no dashboard do Supabase
- A URL do navegador pode ter o formato: `https://supabase.com/dashboard/project/xxxxx`
- O `xxxxx` é parte do seu Project ID
- A Project URL completa seria: `https://xxxxx.supabase.co`

### Opção 4: Settings → General
1. Vá em **Settings** → **General**
2. Procure por **"Reference ID"** ou **"Project URL"**
3. Deve estar listado lá

## ✅ Formato Esperado

A Project URL deve ter este formato:
```
https://wqzffnpgmytwodbkkyxew.supabase.co
```

Ou algo similar, baseado no ID do seu projeto.

## 🔑 Sua Configuração Atual

Já configurei sua **Publishable Key** no `.env.local`:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WqzFFnPgMYGTwoDbTKYXew_1XseHlwN
```

**Falta apenas a Project URL!**

## 📝 Próximo Passo

1. Encontre a Project URL (uma das opções acima)
2. Me envie a URL completa
3. Ou edite o `.env.local` e substitua `SEU-PROJETO-AQUI` pela URL real

## 💡 Dica

A Project URL geralmente começa com a mesma parte inicial da sua publishable key. Por exemplo:
- Key: `sb_publishable_WqzFFnPgMYGTwoDbTKYXew_...`
- URL pode ser: `https://wqzffnpgmytwodbkkyxew.supabase.co`

