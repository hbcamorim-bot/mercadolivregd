import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "contato@mercadolivregd.com";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-energy-500">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base">mercadolivre</span>
                <span className="text-energy-400 font-bold text-base -mt-0.5">GD.com</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Marketplace de energia que conecta clientes e fornecedores para
              gerar economia real na conta de luz em todo o Brasil.
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-energy-400 transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                {EMAIL}
              </a>
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-energy-400 transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                WhatsApp Comercial
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Brasil • Atendimento Nacional
              </div>
            </div>
          </div>

          {/* Para Clientes */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Para Clientes
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/economizar", label: "Quero Economizar" },
                { href: "/simulacao", label: "Simule sua Economia" },
                { href: "/como-funciona#clientes", label: "Como Funciona" },
                { href: "/contato", label: "Fale Conosco" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-energy-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Para Fornecedores */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Para Fornecedores
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/fornecedor", label: "Cadastrar Energia" },
                { href: "/como-funciona#fornecedores", label: "Como Funciona" },
                { href: "/sobre", label: "Sobre a Plataforma" },
                { href: "/contato", label: "Parcerias" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-energy-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Institucional
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/contato", label: "Contato" },
                { href: "/politica-privacidade", label: "Política de Privacidade" },
                { href: "/politica-privacidade#lgpd", label: "LGPD" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-energy-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Mercado Livre GD. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-500 text-center">
            A economia real depende da análise do perfil de consumo, distribuidora e disponibilidade de energia.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/politica-privacidade"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/politica-privacidade#lgpd"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
