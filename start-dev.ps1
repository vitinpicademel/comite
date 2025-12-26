# Script para iniciar ambos os servidores em desenvolvimento
# Uso: .\start-dev.ps1

Write-Host "🚀 Iniciando servidores..." -ForegroundColor Green
Write-Host ""

# Verificar se as dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor Socket.IO em background
Write-Host "🔌 Iniciando servidor Socket.IO na porta 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js" -WindowStyle Normal

# Aguardar um pouco para o Socket.IO iniciar
Start-Sleep -Seconds 2

# Iniciar servidor Next.js
Write-Host "⚡ Iniciando servidor Next.js na porta 3000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

npm run dev

