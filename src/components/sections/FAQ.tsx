"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "O que é o Mercado Livre de Energia (GD)?",
    a: "O Mercado Livre de Energia com Geração Distribuída (GD) permite que consumidores recebam energia de geradores independentes (como usinas solares e eólicas) e paguem menos na conta de luz. A energia é entregue pela própria rede da distribuidora, sem necessidade de obras ou instalações no imóvel.",
  },
  {
    q: "Qualquer pessoa pode aderir?",
    a: "Residências, empresas e estabelecimentos comerciais podem aderir, desde que atendam aos requisitos mínimos de consumo e que existam fornecedores com disponibilidade de energia na sua região e distribuidora. Por isso fazemos uma análise de perfil antes de confirmar a viabilidade.",
  },
  {
    q: "Qual é a economia média esperada?",
    a: "A faixa média estimada é de 20% a 35% de desconto na conta de luz. O percentual exato depende do perfil de consumo, da distribuidora, das condições do contrato com o fornecedor e da disponibilidade de energia. Por isso oferecemos um simulador e uma análise individualizada.",
  },
  {
    q: "Preciso instalar algum equipamento?",
    a: "Não. A energia é gerada em usinas remotas e entregue pela infraestrutura da própria distribuidora. Você não precisa instalar painéis solares nem qualquer outro equipamento no seu imóvel.",
  },
  {
    q: "Meus dados pessoais estão seguros?",
    a: "Sim. Todos os dados coletados são tratados com criptografia e em conformidade com a Lei Geral de Proteção de Dados (LGPD). Os documentos são utilizados exclusivamente para análise técnica e comercial e não são compartilhados sem autorização.",
  },
  {
    q: "Como é feito o contato após o cadastro?",
    a: "Após o recebimento do cadastro e da documentação, nossa equipe entra em contato por e-mail e WhatsApp para apresentar as opções disponíveis para o seu perfil. O processo de negociação é conduzido com transparência e sem pressão.",
  },
  {
    q: "Existe algum custo para se cadastrar?",
    a: "O cadastro na plataforma é gratuito. Os custos envolvidos são os relativos ao próprio contrato de energia, que sempre são menores do que a tarifa convencional — essa é exatamente a proposta do modelo.",
  },
  {
    q: "O fornecedor de energia precisa ser homologado?",
    a: "Sim. Trabalhamos com fornecedores devidamente habilitados e registrados nos órgãos regulatórios do setor elétrico. Nossa plataforma avalia os fornecedores antes de conectá-los com os clientes.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-energy-50 text-energy-600 text-sm font-semibold rounded-full mb-4">
            Dúvidas Frequentes
          </span>
          <h2 className="section-title">Perguntas frequentes</h2>
          <p className="section-subtitle mx-auto">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-navy pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
