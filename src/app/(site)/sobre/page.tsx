import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Eye, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça o Mercado Livre GD, a plataforma que conecta clientes e fornecedores de energia em todo o Brasil.",
};

const VALUES = [
  {
    icon: Target,
    title: "Missão",
    desc: "Democratizar o acesso ao mercado livre de energia, conectando consumidores e fornecedores de forma eficiente, transparente e segura, gerando economia real para todos os envolvidos.",
  },
  {
    icon: Eye,
    title: "Visão",
    desc: "Ser a maior e mais confiável plataforma de marketplace de energia do Brasil, referência em inovação, tecnologia e resultados no setor elétrico.",
  },
  {
    icon: Heart,
    title: "Valores",
    desc: "Transparência, segurança, foco em resultados, ética nos negócios, compromisso com a economia dos clientes e respeito ao meio ambiente.",
  },
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
            Sobre o Mercado Livre GD
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Uma plataforma criada para transformar a forma como o Brasil
            consome e comercializa energia elétrica.
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-slate-600">
            <h2 className="text-3xl font-bold text-navy mb-6">Quem somos</h2>
            <p className="leading-relaxed mb-4">
              O <strong>Mercado Livre GD</strong> é uma plataforma digital de
              marketplace de energia que conecta consumidores que desejam
              economizar na conta de luz com fornecedores de energia renovável
              e geração distribuída (GD) em todo o Brasil.
            </p>
            <p className="leading-relaxed mb-4">
              Nascemos com o propósito de simplificar e democratizar o acesso
              ao mercado livre de energia, tornando o processo transparente,
              seguro e acessível para residências, empresas e estabelecimentos
              comerciais de todo o país.
            </p>
            <p className="leading-relaxed mb-6">
              Nossa plataforma opera como intermediária especializada,
              conduzindo todo o processo: do cadastro inicial, passando pela
              análise de perfil, até o fechamento do contrato e o início da
              economia na conta de energia.
            </p>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nossa essência</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="card border border-transparent hover:border-brand-100 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-energy flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-navy text-xl mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para fazer parte?
          </h2>
          <p className="text-slate-300 mb-8">
            Seja cliente ou fornecedor, o Mercado Livre GD tem uma oportunidade
            para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/economizar" className="btn-primary">
              Quero Economizar
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/fornecedor" className="btn-outline-white">
              Sou Fornecedor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
