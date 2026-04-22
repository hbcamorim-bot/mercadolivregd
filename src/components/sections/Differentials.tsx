import {
  Layers,
  Lock,
  Cpu,
  Handshake,
  Award,
  BarChart2,
} from "lucide-react";

const ITEMS = [
  {
    icon: Layers,
    title: "Plataforma Integrada",
    desc: "Um ecossistema completo que conecta todos os atores do mercado livre de energia.",
  },
  {
    icon: Lock,
    title: "Segurança de Dados",
    desc: "Infraestrutura com criptografia e conformidade total com a LGPD no tratamento de dados.",
  },
  {
    icon: Cpu,
    title: "Tecnologia de Matching",
    desc: "Algoritmo que cruza perfil de consumo dos clientes com oferta disponível dos fornecedores.",
  },
  {
    icon: Handshake,
    title: "Intermediação Especializada",
    desc: "Equipe com experiência no setor elétrico para conduzir negociações com eficiência.",
  },
  {
    icon: Award,
    title: "Foco em Resultado",
    desc: "Trabalhamos orientados a conversão. Só fechamos negócio quando há benefício real para ambos.",
  },
  {
    icon: BarChart2,
    title: "Transparência Total",
    desc: "Dashboard de acompanhamento, status em tempo real e comunicação direta em todo o processo.",
  },
];

export default function Differentials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy font-semibold text-sm rounded-full mb-4">
            Nossos Diferenciais
          </span>
          <h2 className="section-title">
            Uma plataforma feita para o mercado de energia
          </h2>
          <p className="section-subtitle mx-auto">
            Desenvolvemos uma solução completa que une tecnologia, expertise
            setorial e foco genuíno no resultado dos nossos parceiros.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="card group border border-transparent hover:border-brand-100"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-card border border-brand-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1.5">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
