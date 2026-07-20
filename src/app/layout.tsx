import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Mercado Livre GD | Operação para Geração Compartilhada",
    template: "%s | Mercado Livre GD",
  },
  description:
    "Plataforma para estruturar fornecedores, usinas, capacidade, parceiros e locação de quotas em geração compartilhada.",
  keywords: [
    "geração distribuída",
    "geração compartilhada",
    "gestão de capacidade GD",
    "locação de quotas de usina",
    "associação de energia",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mercado Livre GD",
    title: "Mercado Livre GD | Operação para Geração Compartilhada",
    description:
      "Do cadastro da usina à ativação da unidade consumidora, com rastreabilidade e controle de capacidade.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
