"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, Zap, Users, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: TrendingDown, value: "Até 35%", label: "de desconto na conta" },
  { icon: Users, value: "100%", label: "atuação nacional" },
  { icon: ShieldCheck, value: "LGPD", label: "dados protegidos" },
  { icon: Zap, value: "GD", label: "energia limpa" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Energy glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-energy-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Marketplace de Energia · Brasil</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
            Economize na conta de{" "}
            <span className="text-gradient">energia</span> com{" "}
            <span className="text-white">inteligência</span> e{" "}
            <span className="text-gradient">segurança</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
            Conectamos clientes e fornecedores de energia para gerar{" "}
            <strong className="text-white">economia real de 20% a 35%</strong> na conta de luz.
            Simples, seguro e em todo o Brasil.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/economizar"
              className="btn-primary text-base px-8 py-4 group"
            >
              Quero Economizar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/fornecedor"
              className="btn-outline-white text-base px-8 py-4"
            >
              Sou Fornecedor de Energia
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-4 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-energy-500/20 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-energy-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-xs leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 40 864 36C960 32 1056 20 1152 15C1248 10 1344 12 1392 14L1440 16V60H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}
