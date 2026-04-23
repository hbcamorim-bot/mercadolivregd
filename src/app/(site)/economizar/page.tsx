import type { Metadata } from "next";
import ClienteForm from "./ClienteForm";
import { ShieldCheck, FileCheck, Lock, TrendingDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Quero Economizar na Minha Conta de Energia",
  description:
    "Cadastre-se gratuitamente e descubra quanto você pode economizar na conta de luz com o Mercado Livre GD.",
};

const SECURITY = [
  { icon: Lock, text: "Dados criptografados e protegidos" },
  { icon: ShieldCheck, text: "Tratamento conforme a LGPD" },
  { icon: FileCheck, text: "Documentos usados apenas para análise" },
  { icon: TrendingDown, text: "Economia média de 20% a 35%" },
];

export default function EconomizarPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-energy-400 text-sm font-semibold rounded-full mb-4">
              Cadastro Gratuito
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Solicitar análise gratuita
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto">
              Preencha o formulário abaixo. Nossa equipe analisa seu perfil e
              entra em contato com uma proposta antes de qualquer compromisso.
            </p>
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {SECURITY.map((s) => (
              <div key={s.text} className="glass rounded-xl p-3 flex items-center gap-2">
                <s.icon className="w-4 h-4 text-energy-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClienteForm />
        </div>
      </section>
    </div>
  );
}
