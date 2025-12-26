# 🚀 Executar SQL no Supabase - Passo a Passo

## ✅ Status Atual

- ✅ Conexão funcionando (URL e chave corretas)
- ❌ Tabelas não criadas ainda

## 📋 Passo a Passo para Criar as Tabelas

### 1. Abrir o SQL Editor no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **comite-imobiliario**
3. No menu lateral esquerdo, clique em **"SQL Editor"**
4. Clique em **"New query"** (ou use o botão "+")

### 2. Abrir o Arquivo schema.sql

1. No seu projeto local, abra o arquivo:
   ```
   supabase/schema.sql
   ```
2. **Selecione TODO o conteúdo** (Ctrl+A)
3. **Copie** (Ctrl+C)

### 3. Colar e Executar no Supabase

1. No SQL Editor do Supabase, **cole** o conteúdo (Ctrl+V)
2. Verifique se todo o SQL foi colado
3. Clique no botão **"Run"** (ou pressione F5)
4. Aguarde alguns segundos

### 4. Verificar Sucesso

Você deve ver uma mensagem:
```
✅ Success. No rows returned
```

**OU** se aparecer algum erro, me envie a mensagem de erro.

### 5. Verificar Tabelas Criadas

1. No Supabase, vá em **"Table Editor"** (menu lateral)
2. Você deve ver 4 tabelas:
   - ✅ `imoveis`
   - ✅ `avaliacoes`
   - ✅ `sessoes`
   - ✅ `estado_atual`

### 6. Testar Novamente

Depois de executar o SQL, rode o teste novamente:

```bash
npm run test:db
```

**OU** acesse: http://localhost:3000/test-db

## ⚠️ Possíveis Erros

### Erro: "relation already exists"
- Significa que algumas tabelas já existem
- Isso é OK, pode ignorar ou executar novamente

### Erro: "permission denied"
- Verifique se está logado no projeto correto
- Verifique se tem permissões de administrador

### Erro: "syntax error"
- Verifique se copiou TODO o conteúdo do schema.sql
- Não deixe nada faltando

## 🎯 Resumo Rápido

1. Supabase → SQL Editor → New query
2. Abrir `supabase/schema.sql` → Copiar tudo
3. Colar no SQL Editor → Run
4. Verificar sucesso
5. Testar novamente: `npm run test:db`

## ✅ Depois de Executar

Quando executar o SQL com sucesso, todos os testes devem passar! 🎉

