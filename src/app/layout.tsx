import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mercado Livre GD | Marketplace de Energia",
    template: "%s | Mercado Livre GD",
  },
  description:
    "Conectamos clientes e fornecedores de energia para gerar economia na conta de luz em todo o Brasil. Economize até 35% na sua conta de energia.",
  keywords: [
    "energia solar",
    "desconto conta de luz",
    "energia renovável",
    "geração distribuída",
    "marketplace energia",
    "economizar energia",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mercado Livre GD",
    title: "Mercado Livre GD | Marketplace de Energia",
    description:
      "Economize até 35% na sua conta de energia. Conectamos você com fornecedores certificados em todo o Brasil.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
