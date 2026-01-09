# 🚀 Início Rápido - Solução do Problema "Conectando..."

## ⚠️ Problema: Status mostra "Conectando..." em vermelho

Isso significa que o **servidor Socket.IO não está rodando** ou não está acessível.

## ✅ Solução Passo a Passo:

### 1️⃣ Abra um NOVO Terminal PowerShell

**IMPORTANTE:** Mantenha o terminal do Next.js aberto e abra um SEGUNDO terminal.

### 2️⃣ No novo terminal, execute:

```powershell
cd C:\Users\clafl\Desktop\Comite
node server.js
```

Você deve ver:
```
Servidor Socket.IO rodando na porta 3001
Acesse: http://localhost:3001
```

### 3️⃣ Volte para o navegador

Recarregue a página (F5) ou aguarde alguns segundos.

O status deve mudar de **"Conectando..." (vermelho)** para **"Conectado" (verde)**.

## 📋 Resumo:

✅ **Terminal 1** (já está rodando): `npm run dev` - Servidor Next.js  
✅ **Terminal 2** (você precisa abrir): `node server.js` - Servidor Socket.IO

## 🔍 Verificação:

- ✅ Se aparecer "Conectado" em verde = Tudo funcionando!
- ❌ Se continuar "Conectando..." = Verifique se o servidor Socket.IO está rodando

## 💡 Dica:

Mantenha **AMBOS os terminais abertos** durante o desenvolvimento!

