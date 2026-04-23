import type { Metadata } from "next";
import FornecedorForm from "./FornecedorForm";
import { Network, TrendingUp, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sou Fornecedor de Energia",
  description:
    "Cadastre sua disponibilidade de energia e conecte-se com clientes em todo o Brasil.",
};

const BENEFITS = [
  { icon: Users, text: "Acesso a clientes qualificados em todo o Brasil" },
  { icon: TrendingUp, text: "Aumente o volume de contratos e receita" },
  { icon: Network, text: "Matching inteligente com seu perfil de oferta" },
  { icon: Zap, text: "Processo ágil e acompanhamento dedicado" },
];

export default function FornecedorPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-energy-400 text-sm font-semibold rounded-full mb-4">
              Cadastro de Fornecedor
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cadastrar energia disponível
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto">
              Informe sua disponibilidade de energia e conecte-se com clientes
              compatíveis por perfil, localização e distribuidora.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {BENEFITS.map((b) => (
              <div key={b.text} className="glass rounded-xl p-3 flex items-center gap-2">
                <b.icon className="w-4 h-4 text-energy-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FornecedorForm />
        </div>
      </section>
    </div>
  );
}
