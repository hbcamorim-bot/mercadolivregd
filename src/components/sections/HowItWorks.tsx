import Link from "next/link";
import { FileUp, Search, Handshake, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: FileUp,
    title: "Envie seus dados iniciais",
    desc: "Preencha nome, contato, cidade e distribuidora. Informe o valor médio da conta ou anexe a fatura. Leva menos de 3 minutos.",
  },
  {
    icon: Search,
    title: "Analisamos seu perfil",
    desc: "Nossa equipe verifica o consumo, a distribuidora e a elegibilidade. Nenhuma instalação ou obra é necessária.",
  },
  {
    icon: Handshake,
    title: "Buscamos fornecedores compatíveis",
    desc: "Cruzamos seu perfil com fornecedores disponíveis para sua região e distribuidora. Você não precisa fazer nada.",
  },
  {
    icon: CheckCircle2,
    title: "Você recebe a proposta e decide",
    desc: "Apresentamos as condições completas antes de qualquer avanço. Só prosseguimos com sua confirmação.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
            Como funciona
          </span>
          <h2 className="section-title">Da análise ao desconto em 4 etapas</h2>
          <p className="section-subtitle mx-auto">
            Cuidamos de todo o processo. Você envia os dados, nós encontramos o fornecedor e apresentamos a proposta.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-energy-300 via-brand-300 to-energy-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
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
            Entender o processo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
