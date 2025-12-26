/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Desabilitar otimizações de imagem se necessário
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

