import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça o Mercado Livre GD: quem somos, o que fazemos, para quem é e qual é o nosso diferencial.",
};

const DIFERENCIAIS = [
  "Sem placas solares — o desconto aparece na fatura da própria distribuidora",
  "Proposta antes de qualquer compromisso — nada é assinado sem aprovação do cliente",
  "Análise técnica real — não fazemos promessa sem verificar a elegibilidade primeiro",
  "Atuação nacional — operamos em todo o Brasil",
  "Processo conduzido pela nossa equipe — você não precisa entender de energia para economizar",
];

export default function SobrePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-energy-500 flex items-center justify-center shadow-glow">
              <Zap className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre o MercadolivreGD.com
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Uma plataforma de intermediação que conecta quem paga caro na energia
            com quem tem energia disponível para comercializar.
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">Quem somos</h2>
            <p className="text-slate-600 leading-relaxed">
              O <strong>MercadolivreGD.com</strong> é uma plataforma de intermediação de energia renovável.
              Conectamos consumidores que pagam contas altas com geradores de energia solar distribuída
              que têm capacidade disponível para comercializar.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Somos uma equipe especializada em energia distribuída, com foco em organizar e conduzir
              o processo de ponta a ponta — do cadastro do cliente até o fechamento do contrato com o fornecedor.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">O que fazemos</h2>
            <p className="text-slate-600 leading-relaxed">
              Fazemos todo o trabalho: analisamos o perfil do cliente, verificamos a elegibilidade,
              buscamos fornecedores compatíveis por distribuidora e região, e apresentamos a proposta
              com condições claras antes de qualquer avanço.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              O cliente não precisa entender de energia para economizar. O fornecedor não precisa
              prospectar clientes para comercializar. Cuidamos dos dois lados.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">Para quem é</h2>
            <p className="text-slate-600 leading-relaxed">
              Para <strong>residências, condomínios, comércios e indústrias</strong> com contas de energia
              acima de R$ 300/mês que querem reduzir esse custo sem instalar nada.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              E para <strong>geradores de energia solar</strong> que têm capacidade disponível e querem
              comercializá-la de forma eficiente, com leads qualificados e suporte na negociação.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Nossos diferenciais</h2>
            <div className="space-y-3">
              {DIFERENCIAIS.map((d) => (
                <div key={d} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-energy-500 pl-6">
            <p className="text-slate-700 font-medium text-lg leading-relaxed">
              Nosso compromisso é com clareza, agilidade e organização em cada etapa do processo.
              Não prometemos o que não podemos entregar, e não avançamos sem que o cliente esteja
              informado e de acordo.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-slate-300 mb-8">
            A análise é gratuita e sem compromisso. Você recebe a proposta antes de decidir qualquer coisa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/economizar" className="btn-primary">
              Solicitar análise gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/fornecedor" className="btn-outline-white">
              Cadastrar energia disponível
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
