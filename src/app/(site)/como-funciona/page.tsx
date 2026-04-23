import type { Metadata } from "next";
import Link from "next/link";
import {
  FileUp, Search, Zap, CheckCircle2,
  Building2, Users, BarChart3, Handshake,
  ArrowRight, AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Entenda como o Mercado Livre GD conecta clientes e fornecedores de energia: do envio dos dados ao desconto na fatura.",
};

const CLIENT_STEPS = [
  {
    icon: FileUp,
    step: "01",
    title: "Preencha o formulário de análise",
    desc: "Informe nome, contato, cidade, distribuidora e o valor médio da sua conta de energia. Se preferir, faça o upload da fatura. O processo é rápido, gratuito e sem nenhum compromisso.",
  },
  {
    icon: Search,
    step: "02",
    title: "Analisamos seu perfil e sua conta",
    desc: "Nossa equipe verifica o consumo, a distribuidora e os requisitos de elegibilidade. Nenhuma instalação, obra ou troca de equipamento é necessária — o desconto vem como crédito na própria fatura.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Buscamos fornecedores compatíveis",
    desc: "Com base na análise, identificamos fornecedores de energia disponíveis para o seu perfil, região e distribuidora. Você não precisa buscar nada — cuidamos de todo o processo.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Você recebe a proposta e decide",
    desc: "Antes de qualquer avanço, apresentamos a proposta com as condições completas: desconto, prazo e fornecedor. Só prosseguimos com a sua confirmação. Nada é assinado sem aprovação.",
  },
];

const SUPPLIER_STEPS = [
  {
    icon: Building2,
    step: "01",
    title: "Cadastre sua disponibilidade",
    desc: "Informe o volume de kWh disponível para comercialização, as distribuidoras atendidas, a região de atuação e as condições da sua oferta. Processo direto e sem burocracia.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Cruzamos com clientes compatíveis",
    desc: "Nossa equipe analisa os cadastros de clientes e identifica os perfis que combinam com sua oferta por distribuidora, região e volume consumido.",
  },
  {
    icon: Users,
    step: "03",
    title: "Você recebe leads qualificados",
    desc: "Entramos em contato com as oportunidades identificadas. Cada lead tem perfil validado, consumo confirmado e interesse real — sem prospecção de sua parte.",
  },
  {
    icon: Handshake,
    step: "04",
    title: "Acompanhe e feche negócios",
    desc: "Nossa equipe apoia na condução das negociações. Você foca no fechamento enquanto cuidamos da parte operacional e do relacionamento com o cliente.",
  },
];

function StepCard({
  icon: Icon, step, title, desc, accent,
}: {
  icon: React.ElementType; step: string; title: string; desc: string; accent: "energy" | "brand";
}) {
  const c = accent === "energy"
    ? { bg: "bg-energy-50", text: "text-energy-600", num: "bg-energy-500" }
    : { bg: "bg-brand-50", text: "text-brand-600", num: "bg-brand-500" };

  return (
    <div className="flex gap-5 p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex-shrink-0 relative">
        <div className={`w-14 h-14 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${c.text}`} strokeWidth={1.5} />
        </div>
        <span className={`absolute -top-2 -left-2 w-6 h-6 ${c.num} text-white text-xs font-bold flex items-center justify-center rounded-full`}>
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
            Do envio dos dados ao desconto na fatura
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Um processo estruturado, transparente e sem compromisso inicial.
            Você envia os dados, nós cuidamos do resto.
          </p>
        </div>
      </section>

      {/* Aviso sem placas */}
      <section className="bg-energy-500 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-navy font-semibold text-sm md:text-base">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            Não é necessário instalar placas solares, trocar medidor ou fazer qualquer obra. O desconto aparece diretamente na sua fatura.
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section id="clientes" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
              Para Clientes
            </span>
            <h2 className="section-title">Como você começa a economizar</h2>
            <p className="section-subtitle mx-auto">
              A análise inicial é gratuita e sem compromisso. Você só avança se quiser, depois de ver a proposta.
            </p>
          </div>
          <div className="space-y-5">
            {CLIENT_STEPS.map((s) => (
              <StepCard key={s.step} {...s} accent="energy" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/economizar" className="btn-primary">
              Solicitar análise sem compromisso
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
            <h2 className="section-title">Como comercializar sua energia</h2>
            <p className="section-subtitle mx-auto">
              Cadastre sua disponibilidade e receba oportunidades qualificadas,
              sem precisar prospectar clientes.
            </p>
          </div>
          <div className="space-y-5">
            {SUPPLIER_STEPS.map((s) => (
              <StepCard key={s.step} {...s} accent="brand" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/fornecedor" className="btn-secondary">
              Cadastrar energia disponível
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
