# 🗄️ Integração com Supabase - Guia Completo

## ✅ Por que Supabase?

- ✅ **100% Gratuito** até 500MB de banco
- ✅ **PostgreSQL** (banco relacional robusto)
- ✅ **Realtime nativo** (atualizações instantâneas)
- ✅ **Fácil de usar** (dashboard web)
- ✅ **Escalável** (pode crescer conforme necessário)

## 🚀 Setup Rápido (5 minutos)

### 1. Criar Conta e Projeto

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login (GitHub/Google/Email)
4. Clique em **"New Project"**
5. Preencha:
   - Name: `comite-imobiliario`
   - Database Password: (anote esta senha!)
   - Region: `South America (São Paulo)`
6. Aguarde 2-3 minutos

### 2. Obter Credenciais

1. No dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: (chave longa começando com `eyJ...`)

### 3. Configurar Variáveis

Edite `.env.local` e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Substitua pelos valores reais do seu projeto!**

### 4. Criar Tabelas

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **"Run"** (ou pressione F5)
7. Deve aparecer: ✅ "Success"

### 5. Habilitar Realtime

1. Vá em **Database** → **Replication**
2. Ative Realtime para:
   - ✅ `imoveis`
   - ✅ `avaliacoes`
   - ✅ `sessoes`
   - ✅ `estado_atual`

Ou execute no SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE imoveis;
ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE sessoes;
ALTER PUBLICATION supabase_realtime ADD TABLE estado_atual;
```

### 6. Instalar e Testar

```bash
npm install
npm run dev
```

## 📊 Estrutura do Banco

### Tabelas Criadas:

1. **`imoveis`** - Cadastro de imóveis
2. **`avaliacoes`** - Avaliações dos corretores
3. **`sessoes`** - Histórico de avaliações finalizadas
4. **`estado_atual`** - Estado da sessão ativa

## 🔄 Como Funciona

### Antes (Socket.IO apenas):
- Dados em memória
- Perdidos ao reiniciar servidor
- Sem histórico persistente

### Agora (Supabase):
- ✅ Dados salvos no banco
- ✅ Persistem após reiniciar
- ✅ Histórico completo
- ✅ Realtime automático
- ✅ Múltiplos servidores sincronizados

## 🎯 Funcionalidades

### Realtime Automático
- Quando um corretor envia avaliação → Todos veem instantaneamente
- Quando CEO inicia avaliação → Todos os corretores são notificados
- Quando CEO finaliza → Resultados aparecem para todos

### Persistência
- Histórico salvo automaticamente
- Dados não se perdem
- Pode consultar histórico antigo

### Escalabilidade
- Funciona com múltiplos servidores
- Suporta muitos usuários simultâneos
- Banco de dados otimizado

## 📝 Exemplo de Uso

### No código, use os hooks:

```typescript
import { useEstadoAtual, useAvaliacoes } from '@/hooks/useSupabaseRealtime'

// No componente
const { estado } = useEstadoAtual()
const { avaliacoes } = useAvaliacoes(estado?.imovel_ativo_id || null)
```

## 🔒 Segurança

- A chave `anon` é segura para usar no frontend
- Supabase usa Row Level Security (RLS)
- Para produção, configure políticas de segurança

## 📈 Limites Gratuitos

- ✅ 500MB de banco
- ✅ 2GB bandwidth/mês
- ✅ 2 milhões de requisições/mês
- ✅ Realtime ilimitado

**Suficiente para o projeto!**

## 🆘 Troubleshooting

### Erro: "Invalid API key"
→ Verifique se copiou a chave completa

### Erro: "relation does not exist"
→ Execute o schema.sql novamente

### Realtime não funciona
→ Verifique se habilitou Realtime nas tabelas

## 🎉 Pronto!

Agora seu sistema tem:
- ✅ Banco de dados real
- ✅ Persistência de dados
- ✅ Realtime automático
- ✅ Histórico completo

