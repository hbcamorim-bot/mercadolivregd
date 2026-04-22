import Link from "next/link";
import { ClipboardList, Search, Handshake, CheckCircle2 } from "lucide-react";

const CLIENT_STEPS = [
  {
    icon: ClipboardList,
    title: "Envie seus dados",
    desc: "Preencha o formulário com seus dados e faça upload da conta de energia. Processo simples e seguro.",
  },
  {
    icon: Search,
    title: "Análise de perfil",
    desc: "Nossa equipe analisa seu perfil de consumo, distribuidora e o potencial de economia disponível.",
  },
  {
    icon: Handshake,
    title: "Conexão com fornecedor",
    desc: "Identificamos o fornecedor ideal para o seu perfil e iniciamos o processo de negociação.",
  },
  {
    icon: CheckCircle2,
    title: "Economia na conta",
    desc: "Com o contrato assinado, a economia aparece automaticamente nas próximas faturas.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
            Processo Simples
          </span>
          <h2 className="section-title">Como funciona o Mercado Livre GD?</h2>
          <p className="section-subtitle mx-auto">
            Em apenas 4 etapas, você conecta sua demanda de energia com
            fornecedores certificados e começa a economizar.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-energy-300 via-brand-300 to-energy-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CLIENT_STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {/* Number + Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-energy flex items-center justify-center shadow-glow">
                    <step.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-navy font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/como-funciona" className="btn-secondary">
            Ver detalhes completos
          </Link>
        </div>
      </div>
    </section>
  );
}
