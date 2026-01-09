import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Comite avaliativo Donna Negociações',
  description: 'Sistema de avaliação imobiliária em tempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

