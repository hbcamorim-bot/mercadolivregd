import type { Metadata } from "next";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a equipe do MercadolivreGD.com — tire dúvidas, envie sua conta para análise ou converse sobre fornecimento de energia.",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "contato@mercadolivregd.com";

const waClientUrl = `https://wa.me/${WA}?text=${encodeURIComponent("Olá! Gostaria de enviar minha conta de energia para análise.")}`;
const waSupplierUrl = `https://wa.me/${WA}?text=${encodeURIComponent("Olá! Sou fornecedor de energia e gostaria de conversar sobre parceria.")}`;

export default function ContatoPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fale com a nossa equipe
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Tire dúvidas, envie sua conta para análise ou converse sobre fornecimento de energia.
            Nossa equipe responde em até 1 dia útil.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Coluna esquerda: info + CTAs */}
            <div className="space-y-6">
              {/* Info cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, title: "WhatsApp", value: "Atendimento comercial", href: waClientUrl, label: "Iniciar conversa" },
                  { icon: Mail, title: "E-mail", value: EMAIL, href: `mailto:${EMAIL}`, label: "Enviar e-mail" },
                  { icon: Clock, title: "Horário", value: "Seg. a Sex. · 9h às 18h", href: null, label: null },
                  { icon: MapPin, title: "Atuação", value: "Todo o Brasil", href: null, label: null },
                ].map((c) => (
                  <div key={c.title} className="card">
                    <div className="w-10 h-10 rounded-xl bg-energy-50 flex items-center justify-center mb-3">
                      <c.icon className="w-5 h-5 text-energy-600" />
                    </div>
                    <h3 className="font-bold text-navy text-sm mb-1">{c.title}</h3>
                    <p className="text-slate-500 text-sm mb-2">{c.value}</p>
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
                ))}
              </div>

              {/* WhatsApp CTAs */}
              <div className="bg-navy rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold text-base">Iniciar conversa direta</h3>
                <a
                  href={waClientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-energy-500 hover:bg-energy-400 text-navy font-semibold text-sm rounded-xl transition-colors"
                >
                  <span>Enviar conta para análise</span>
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={waSupplierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 border border-white/20 hover:border-white/40 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <span>Falar sobre fornecimento</span>
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Coluna direita: formulário */}
            <div>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
