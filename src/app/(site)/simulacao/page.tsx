"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Info, TrendingDown } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function SimulacaoPage() {
  const [valorConta, setValorConta] = useState<number>(600);
  const [desconto, setDesconto] = useState<number>(25);

  const economiaMensal = (valorConta * desconto) / 100;
  const economiaAnual = economiaMensal * 12;
  const economia3Anos = economiaAnual * 3;
  const economia5Anos = economiaAnual * 5;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-energy-400 text-sm font-semibold rounded-full mb-6">
            Calculadora de Economia
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simule sua economia de energia
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Descubra quanto você pode economizar por mês, por ano e nos
            próximos 5 anos com o Mercado Livre GD.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card shadow-xl">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-energy flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-navy">Simulador de Economia</h2>
                <p className="text-xs text-slate-400">Calcule sua economia estimada</p>
              </div>
            </div>

            <div className="space-y-8 mb-8">
              {/* Valor da conta */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="label mb-0 text-base">
                    Valor médio atual da conta de energia
                  </label>
                  <span className="text-3xl font-bold text-navy">
                    {fmt(valorConta)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={50}
                  value={valorConta}
                  onChange={(e) => setValorConta(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00C896 0%, #00C896 ${((valorConta - 100) / 9900) * 100}%, #E2E8F0 ${((valorConta - 100) / 9900) * 100}%, #E2E8F0 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>R$ 100</span>
                  <span>R$ 10.000</span>
                </div>
              </div>

              {/* Desconto */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="label mb-0 text-base">
                    Percentual de desconto estimado
                  </label>
                  <span className="text-3xl font-bold text-energy-500">
                    {desconto}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={1}
                  value={desconto}
                  onChange={(e) => setDesconto(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00C896 0%, #00C896 ${((desconto - 10) / 30) * 100}%, #E2E8F0 ${((desconto - 10) / 30) * 100}%, #E2E8F0 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-1.5">
                  <span className="text-slate-400">10%</span>
                  <span className="text-energy-600 font-semibold">
                    Faixa média: 20% a 35%
                  </span>
                  <span className="text-slate-400">40%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-navy to-navy-600 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-5 h-5 text-energy-400" />
                <span className="text-sm font-semibold text-energy-400 uppercase tracking-wider">
                  Sua economia estimada
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Por mês", value: fmt(economiaMensal), highlight: true },
                  { label: "Por ano", value: fmt(economiaAnual), highlight: false },
                  { label: "Em 3 anos", value: fmt(economia3Anos), highlight: false },
                  { label: "Em 5 anos", value: fmt(economia5Anos), highlight: false },
                ].map((r) => (
                  <div key={r.label} className="text-center">
                    <div
                      className={`text-xl md:text-2xl font-bold mb-1 ${
                        r.highlight ? "text-energy-400" : "text-white"
                      }`}
                    >
                      {r.value}
                    </div>
                    <div className="text-xs text-slate-400">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <strong>Atenção:</strong> Esta simulação é apenas uma estimativa
                indicativa com base nos valores informados. A economia real
                depende de análise individualizada do perfil de consumo,
                distribuidora, disponibilidade de energia e condições
                contratuais. Os valores finais são apresentados após a análise
                técnica pelo nosso time.
              </p>
            </div>

            <div className="text-center">
              <Link href="/economizar" className="btn-primary w-full sm:w-auto px-10 py-4 text-base">
                Quero este desconto real
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-400 mt-3">
                Cadastro gratuito · Sem compromisso · Sem instalação
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
