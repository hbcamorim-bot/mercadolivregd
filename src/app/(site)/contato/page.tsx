import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o Mercado Livre GD por e-mail ou WhatsApp.",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "contato@mercadolivregd.com";

const waClientUrl = `https://wa.me/${WA}?text=${encodeURIComponent(
  "Olá! Gostaria de informações sobre como economizar na minha conta de energia."
)}`;
const waSupplierUrl = `https://wa.me/${WA}?text=${encodeURIComponent(
  "Olá! Sou fornecedor de energia e gostaria de saber mais sobre a plataforma."
)}`;

const CONTACTS = [
  {
    icon: Mail,
    title: "E-mail",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    label: "Enviar e-mail",
  },
  {
    icon: Phone,
    title: "WhatsApp Comercial",
    value: "Atendimento via WhatsApp",
    href: waClientUrl,
    label: "Abrir WhatsApp",
  },
  {
    icon: MapPin,
    title: "Atuação",
    value: "Todo o Brasil",
    href: null,
    label: null,
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    value: "Seg. a Sex. 09h – 18h",
    href: null,
    label: null,
  },
];

export default function ContatoPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Entre em contato
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Fale com nossa equipe por e-mail ou WhatsApp. Estamos prontos para
            tirar suas dúvidas e ajudar no processo.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {CONTACTS.map((c) => (
              <div key={c.title} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-energy-50 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-energy-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy mb-1">{c.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{c.value}</p>
                    {c.href && c.label && (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-energy-600 hover:text-energy-700 transition-colors"
                      >
                        {c.label} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTAs */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-navy rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                Quero economizar na energia
              </h3>
              <p className="text-slate-400 text-sm mb-5">
                Fale com nossa equipe comercial sobre como reduzir sua conta de
                luz.
              </p>
              <a
                href={waClientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Fale pelo WhatsApp
              </a>
            </div>
            <div className="bg-brand-600 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                Sou fornecedor de energia
              </h3>
              <p className="text-blue-100 text-sm mb-5">
                Converse com nossa equipe sobre oportunidades de parceria e
                comercialização.
              </p>
              <a
                href={waSupplierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white w-full"
              >
                Fale pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
