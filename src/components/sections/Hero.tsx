"use client";

import Link from "next/link";
import { ArrowRight, FileSearch, ShieldCheck, Zap, BadgeCheck } from "lucide-react";

const TRUST = [
  { icon: FileSearch, value: "Análise gratuita", label: "sem compromisso" },
  { icon: BadgeCheck, value: "Proposta antes", label: "de qualquer avanço" },
  { icon: Zap, value: "Sem placas solares", label: "nenhuma instalação" },
  { icon: ShieldCheck, value: "LGPD", label: "dados protegidos" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-energy-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Marketplace de Energia · Brasil</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
            Desconto real na conta de{" "}
            <span className="text-gradient">energia</span>,{" "}
            <span className="text-gradient">sem instalar</span> nada
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-4 max-w-2xl">
            Envie sua conta de energia. Analisamos seu perfil, buscamos fornecedores compatíveis
            e apresentamos uma proposta antes de qualquer compromisso.
          </p>
          <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-xl">
            Economia de <strong className="text-white">20% a 35%</strong> diretamente na fatura — sem obras, sem troca de medidor, sem burocracia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/economizar" className="btn-primary text-base px-8 py-4 group">
              Solicitar análise sem compromisso
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/fornecedor" className="btn-outline-white text-base px-8 py-4">
              Cadastrar energia disponível
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map((item) => (
              <div key={item.label} className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-energy-500/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-energy-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">{item.value}</div>
                  <div className="text-slate-400 text-xs leading-tight">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 40 864 36C960 32 1056 20 1152 15C1248 10 1344 12 1392 14L1440 16V60H0Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
