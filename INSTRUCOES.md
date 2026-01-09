# Instruções para Iniciar o Sistema

## ⚠️ IMPORTANTE: Você precisa iniciar DOIS servidores

O sistema precisa de dois servidores rodando simultaneamente:

1. **Servidor Socket.IO** (porta 3001) - Para comunicação em tempo real
2. **Servidor Next.js** (porta 3000) - Para a aplicação web

## 🚀 Como Iniciar

### Opção 1: Dois Terminais (Recomendado)

**Terminal 1 - Servidor Socket.IO:**
```bash
npm run dev:socket
```
ou
```bash
node server.js
```

**Terminal 2 - Servidor Next.js:**
```bash
npm run dev
```

### Opção 2: Usando PowerShell (Windows)

Abra dois terminais PowerShell e execute:

**Terminal 1:**
```powershell
cd C:\Users\clafl\Desktop\Comite
node server.js
```

**Terminal 2:**
```powershell
cd C:\Users\clafl\Desktop\Comite
npm run dev
```

## ✅ Verificação

Após iniciar ambos os servidores, você deve ver:

**Terminal 1 (Socket.IO):**
```
Servidor Socket.IO rodando na porta 3001
Acesse: http://localhost:3001
```

**Terminal 2 (Next.js):**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## 🌐 Acessar a Aplicação

Abra seu navegador em:
```
http://localhost:3000
```

## 🔧 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Limpe o cache e reinstale
Remove-Item -Recurse -Force .next
npm install
```

### Erro: "Port already in use"
- Certifique-se de que não há outros processos usando as portas 3000 ou 3001
- Feche outros servidores Next.js ou Socket.IO que possam estar rodando

### Socket.IO não conecta
- Verifique se o servidor Socket.IO está rodando na porta 3001
- Verifique o arquivo `.env.local` (deve ter `NEXT_PUBLIC_SOCKET_URL=http://localhost:3001`)

## 📝 Notas

- O servidor Socket.IO DEVE estar rodando antes de abrir a aplicação no navegador
- Se você fechar qualquer um dos servidores, a aplicação não funcionará corretamente
- Para desenvolvimento, mantenha ambos os terminais abertos

