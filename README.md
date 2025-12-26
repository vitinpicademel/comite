# 🏠 Comitê Avaliativo Imobiliário

Sistema web moderno e responsivo para avaliação imobiliária em tempo real, desenvolvido com Next.js 14, Tailwind CSS, Framer Motion, Socket.IO e Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

## 🎨 Características de Design

- **Dark Mode Elegante**: Tema escuro com cores Slate-950 e acentos Emerald-500
- **Glassmorphism**: Efeito de vidro fosco com transparência e desfoque
- **Animações Suaves**: Framer Motion para transições e revelações
- **Tipografia Moderna**: Fonte Inter com números legíveis
- **Otimizado para Datashow**: Interface projetada para projeção em telas grandes

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos
- **Socket.IO** - Comunicação em tempo real
- **Supabase** - Banco de dados PostgreSQL com Realtime

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/comite-avaliativo-imobiliario.git
cd comite-avaliativo-imobiliario
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Supabase:**
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Execute o SQL em `supabase/schema.sql` no SQL Editor
   - Copie a URL e a chave anon do projeto

4. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env.local`
   - Preencha com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

5. **Inicie o servidor Socket.IO (Terminal 1):**
```bash
npm run dev:socket
```

6. **Inicie o servidor Next.js (Terminal 2):**
```bash
npm run dev
```

7. **Acesse no navegador:**
```
http://localhost:3000
```

> 📖 **Documentação completa do Supabase:** Veja `SUPABASE-SETUP.md`

## 🎯 Funcionalidades

### Dashboard CEO (Admin)

- ✅ **Header Estatístico**: Contador animado de imóveis avaliados
- ✅ **Cadastro de Imóvel**: Formulário com validação
- ✅ **Controle de Fluxo**: Botões com efeitos neon para iniciar/encerrar
- ✅ **Visualização de Resultados**: Revelação animada dos valores
- ✅ **Média em Destaque**: Card central com efeito glow verde
- ✅ **Histórico Completo**: Lista organizada de todas as avaliações

### Painel Corretor

- ✅ **Interface Mobile-First**: Design limpo e responsivo
- ✅ **Máscara de Moeda**: Formatação automática em R$
- ✅ **Feedback Visual**: Confirmação imediata de voto enviado
- ✅ **Sincronização em Tempo Real**: Atualizações instantâneas

### Sistema de Tempo Real

- ✅ **Socket.IO**: Comunicação bidirecional instantânea
- ✅ **Supabase Realtime**: Atualizações automáticas do banco de dados
- ✅ **Sincronização Automática**: Todos os clientes atualizam simultaneamente
- ✅ **Persistência**: Dados salvos permanentemente no banco
- ✅ **Histórico Completo**: Todas as avaliações são registradas

## 📁 Estrutura do Projeto

```
Comite/
├── app/
│   ├── api/                # API Routes
│   │   ├── estado/         # Endpoints de estado
│   │   └── avaliacoes/     # Endpoints de avaliações
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   └── globals.css         # Estilos globais
├── components/
│   ├── DashboardCEO.tsx    # Painel do administrador
│   ├── DashboardCorretor.tsx # Painel do corretor
│   ├── AnimatedCounter.tsx  # Contador animado
│   ├── ResultadosRevelacao.tsx # Revelação de resultados
│   └── HistoricoLista.tsx   # Lista de histórico
├── hooks/
│   └── useSupabaseRealtime.ts # Hooks para Realtime
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   └── database.ts         # Funções do banco
├── supabase/
│   └── schema.sql          # Schema do banco
├── server.js               # Servidor Socket.IO
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Paleta de Cores

- **Fundo**: `slate-950` (rgb(2, 6, 23))
- **Acentos**: `emerald-500` (rgb(16, 185, 129))
- **Glassmorphism**: `rgba(15, 23, 42, 0.7)` com blur
- **Texto**: `slate-400` para secundário, `white` para primário

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📺 Datashows e telas grandes (projeção)
- 💻 Desktops
- 📱 Tablets
- 📱 Smartphones

## 🎬 Animações

- **Fade In**: Aparição suave de elementos
- **Slide Up**: Entrada de baixo para cima
- **Glow**: Efeito de brilho na média final
- **Counter**: Animação do contador numérico
- **Revelação**: Valores aparecem sequencialmente

## 🔐 Segurança

- Validação de dados no cliente e servidor
- Prevenção de duplicação de votos
- Sincronização de estado confiável

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático a cada push!

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

> ⚠️ **Importante:** Para produção, você precisará configurar o servidor Socket.IO separadamente ou usar apenas Supabase Realtime.

## 📝 Notas

- O servidor Socket.IO deve estar rodando na porta 3001 (desenvolvimento)
- O Next.js roda na porta 3000 por padrão
- Supabase é necessário para persistência de dados
- Cada corretor pode atualizar seu voto antes do encerramento
- Dados são salvos automaticamente no banco

## 📚 Documentação Adicional

- [Setup do Supabase](SUPABASE-SETUP.md) - Guia completo de configuração
- [README Supabase](README-SUPABASE.md) - Documentação da integração

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido com

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Socket.IO
