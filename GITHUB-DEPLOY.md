# 🚀 Guia para Deploy no GitHub

## ✅ Build Concluído!

O projeto foi buildado com sucesso e está pronto para ser enviado ao GitHub.

## 📋 Passos para Enviar ao GitHub

### 1. Inicializar Git (se ainda não foi feito)

```bash
git init
```

### 2. Adicionar todos os arquivos

```bash
git add .
```

### 3. Fazer o primeiro commit

```bash
git commit -m "Initial commit: Comitê Avaliativo Imobiliário"
```

### 4. Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Crie um novo repositório
3. **NÃO** inicialize com README (já temos um)
4. Copie a URL do repositório

### 5. Conectar ao repositório remoto

```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
```

### 6. Enviar para o GitHub

```bash
git branch -M main
git push -u origin main
```

## 🔐 Variáveis de Ambiente no GitHub

Se você for usar GitHub Actions ou deploy automático:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione as variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Arquivos Importantes

✅ **Incluídos no Git:**
- Todo o código fonte
- `package.json`
- `README.md`
- `supabase/schema.sql`
- `.gitignore` (configurado)

❌ **NÃO incluídos (por segurança):**
- `.env.local` (credenciais)
- `node_modules/`
- `.next/` (build)

## 🎯 Próximos Passos

Após enviar ao GitHub, você pode:

1. **Deploy na Vercel:**
   - Conecte o repositório
   - Configure as variáveis de ambiente
   - Deploy automático!

2. **Deploy em outras plataformas:**
   - Netlify
   - Railway
   - Render

## ✅ Checklist

- [x] Build passou sem erros
- [x] `.gitignore` configurado
- [x] `README.md` atualizado
- [x] `.env.example` criado
- [ ] Repositório GitHub criado
- [ ] Código enviado ao GitHub
- [ ] Variáveis de ambiente configuradas (se necessário)

## 🎉 Pronto!

Seu projeto está pronto para ser compartilhado e deployado!

