import Link from "next/link";
import {
  TrendingDown,
  ShieldCheck,
  FileCheck,
  Headphones,
  BarChart3,
  Globe,
} from "lucide-react";

const BENEFITS = [
  {
    icon: TrendingDown,
    title: "Economia Real de 20% a 35%",
    desc: "Desconto efetivo na conta de luz todos os meses. A economia depende do seu perfil de consumo e disponibilidade de energia.",
  },
  {
    icon: ShieldCheck,
    title: "Processo 100% Seguro",
    desc: "Seus dados são protegidos por criptografia e tratados conforme as diretrizes da LGPD.",
  },
  {
    icon: FileCheck,
    title: "Sem Obras ou Instalações",
    desc: "Você não precisa instalar nada. A energia chega pela própria rede da distribuidora com desconto na fatura.",
  },
  {
    icon: Headphones,
    title: "Suporte Dedicado",
    desc: "Equipe especializada para acompanhar todo o processo do cadastro à conclusão da negociação.",
  },
  {
    icon: BarChart3,
    title: "Simulação Transparente",
    desc: "Calcule sua economia estimada antes de qualquer compromisso. Clareza total no processo.",
  },
  {
    icon: Globe,
    title: "Atendimento Nacional",
    desc: "Atuamos com fornecedores em todo o Brasil, atendendo diversas distribuidoras e regiões.",
  },
];

export default function BenefitsClients() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left — text */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
              Para Clientes
            </span>
            <h2 className="section-title mb-4">
              Por que escolher o Mercado Livre GD?
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Você merece pagar menos por energia sem abrir mão de qualidade
              ou segurança. Com o Mercado Livre GD, o processo é simples,
              transparente e protegido.
            </p>
            <Link href="/economizar" className="btn-primary">
              Quero Economizar
            </Link>
          </div>

          {/* Right — benefits grid */}
          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card group hover:border-energy-200 border border-transparent transition-all">
                <div className="w-11 h-11 rounded-xl bg-energy-50 flex items-center justify-center mb-4 group-hover:bg-energy-100 transition-colors">
                  <b.icon className="w-5 h-5 text-energy-600" />
                </div>
                <h3 className="font-bold text-navy mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
