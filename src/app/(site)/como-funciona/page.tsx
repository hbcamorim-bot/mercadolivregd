import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList, Search, Handshake, CheckCircle2,
  Building2, MapPin, BarChart3, Users,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Entenda o processo completo do Mercado Livre GD, do cadastro à economia na conta de luz.",
};

const CLIENT_STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Envie seus dados e documentos",
    desc: "Preencha o formulário com seus dados pessoais, endereço e informações sobre sua conta de energia. Faça o upload da conta de luz e de um documento de identificação. O processo é simples, rápido e 100% seguro.",
  },
  {
    icon: Search,
    step: "02",
    title: "Análise do perfil de consumo",
    desc: "Nossa equipe técnica analisa seu perfil de consumo, distribuidora, histórico de conta e os requisitos para elegibilidade ao mercado livre de energia. Buscamos identificar o melhor cenário de economia para o seu caso.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Matching com fornecedor ideal",
    desc: "Com base na análise, identificamos fornecedores de energia disponíveis para o seu perfil, região e distribuidora. Iniciamos a negociação e apresentamos a proposta com condições claras e transparentes.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Contrato e desconto na conta",
    desc: "Com a proposta aceita, o contrato é formalizado. A partir das próximas faturas, você passa a receber o desconto diretamente na conta de luz, sem nenhuma instalação ou mudança de comportamento necessária.",
  },
];

const SUPPLIER_STEPS = [
  {
    icon: Building2,
    step: "01",
    title: "Cadastre sua disponibilidade",
    desc: "Informe o volume de kWh disponível para comercialização, as distribuidoras atendidas e a região de atuação. O cadastro é objetivo e direto.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Defina sua área de atendimento",
    desc: "Configure quais estados, regiões e distribuidoras você atende. Isso permite que a plataforma faça um matching preciso com os clientes compatíveis.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Receba oportunidades qualificadas",
    desc: "Nossa equipe entra em contato com as oportunidades de negócio identificadas. Você recebe leads qualificados, com perfil de consumo validado, prontos para negociação.",
  },
  {
    icon: Users,
    step: "04",
    title: "Acompanhe e feche negócios",
    desc: "Acompanhe o andamento de cada oportunidade na plataforma. Nossa equipe apoia na condução das negociações para maximizar o volume de contratos fechados.",
  },
];

function StepCard({
  icon: Icon,
  step,
  title,
  desc,
  accent,
}: {
  icon: React.ElementType;
  step: string;
  title: string;
  desc: string;
  accent: "energy" | "brand";
}) {
  const colors =
    accent === "energy"
      ? { bg: "bg-energy-50", text: "text-energy-600", num: "bg-energy-500" }
      : { bg: "bg-brand-50", text: "text-brand-600", num: "bg-brand-500" };

  return (
    <div className="flex gap-5 p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex-shrink-0 relative">
        <div
          className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}
        >
          <Icon className={`w-7 h-7 ${colors.text}`} strokeWidth={1.5} />
        </div>
        <span
          className={`absolute -top-2 -left-2 w-6 h-6 ${colors.num} text-white text-xs font-bold flex items-center justify-center rounded-full`}
        >
          {step}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-navy mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function ComoFuncionaPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-energy-400 text-sm font-semibold rounded-full mb-6">
            Processo Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Como funciona o Mercado Livre GD?
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Um processo transparente e estruturado, do cadastro inicial até a
            economia mensal na sua conta de energia.
          </p>
        </div>
      </section>

      {/* Clientes */}
      <section id="clientes" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
              Para Clientes
            </span>
            <h2 className="section-title">Sua jornada para economizar</h2>
            <p className="section-subtitle mx-auto">
              Em 4 etapas simples, você passa da conta cara para uma conta com
              desconto real.
            </p>
          </div>
          <div className="space-y-5">
            {CLIENT_STEPS.map((s) => (
              <StepCard key={s.step} {...s} accent="energy" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/economizar" className="btn-primary">
              Quero Economizar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fornecedores */}
      <section id="fornecedores" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-sm font-semibold rounded-full mb-4">
              Para Fornecedores
            </span>
            <h2 className="section-title">
              Como oferecer energia na plataforma
            </h2>
            <p className="section-subtitle mx-auto">
              Cadastre sua disponibilidade e conecte-se com clientes
              qualificados em todo o Brasil.
            </p>
          </div>
          <div className="space-y-5">
            {SUPPLIER_STEPS.map((s) => (
              <StepCard key={s.step} {...s} accent="brand" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/fornecedor" className="btn-secondary">
              Cadastrar minha energia
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
