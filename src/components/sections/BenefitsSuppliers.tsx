import Link from "next/link";
import {
  DollarSign,
  Network,
  TrendingUp,
  Clock,
  MapPin,
  Star,
} from "lucide-react";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Monetize sua Energia",
    desc: "Oferte o excedente de geração e receba pela energia que seria desperdiçada ou remunerada a valores menores.",
  },
  {
    icon: Network,
    title: "Acesso a Demanda Qualificada",
    desc: "Conecte-se com clientes reais e interessados em assinar contratos de energia com desconto.",
  },
  {
    icon: TrendingUp,
    title: "Escala com Controle",
    desc: "Você define a quantidade de kWh disponível, a região e as distribuidoras que atende.",
  },
  {
    icon: Clock,
    title: "Processo Ágil",
    desc: "Cadastro simples e rápido. Nossa equipe cuida da análise e do matching com clientes compatíveis.",
  },
  {
    icon: MapPin,
    title: "Multi-Região",
    desc: "Atenda clientes em uma ou mais regiões do Brasil, conforme a abrangência da sua geração.",
  },
  {
    icon: Star,
    title: "Parceria Estratégica",
    desc: "Posicione sua empresa como fornecedor confiável dentro de um marketplace de energia em crescimento.",
  },
];

export default function BenefitsSuppliers() {
  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-energy-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
          {/* Right — text */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-energy-400 text-sm font-semibold rounded-full mb-4">
              Para Fornecedores
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oferte energia e amplie seus negócios
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Se você tem energia disponível para comercializar, o Mercado
              Livre GD conecta você com consumidores em todo o Brasil de
              forma eficiente e estruturada.
            </p>
            <Link href="/fornecedor" className="btn-primary">
              Cadastrar minha energia
            </Link>
          </div>

          {/* Left — benefits grid */}
          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="glass rounded-2xl p-6 hover:bg-white/12 transition-colors border border-white/10 group"
              >
                <div className="w-11 h-11 rounded-xl bg-energy-500/20 flex items-center justify-center mb-4 group-hover:bg-energy-500/30 transition-colors">
                  <b.icon className="w-5 h-5 text-energy-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
