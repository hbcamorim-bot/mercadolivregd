"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Info } from "lucide-react";

export default function EconomySimulator() {
  const [valorConta, setValorConta] = useState<number>(500);
  const [desconto, setDesconto] = useState<number>(25);

  const economiaMensal = (valorConta * desconto) / 100;
  const economiaAnual = economiaMensal * 12;
  const economia5Anos = economiaAnual * 5;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <section id="simulacao" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-sm font-semibold rounded-full mb-4">
            Simulador de Economia
          </span>
          <h2 className="section-title">
            Quanto você pode economizar?
          </h2>
          <p className="section-subtitle mx-auto">
            Calcule uma estimativa da sua economia. O valor real é determinado
            após análise do perfil completo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-energy flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Simulador de Economia</h3>
                <p className="text-xs text-slate-400">Estimativa baseada em dados informados</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-8 mb-8">
              {/* Valor da conta */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="label mb-0">
                    Valor médio atual da conta de energia
                  </label>
                  <span className="text-2xl font-bold text-navy">
                    {fmt(valorConta)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={valorConta}
                  onChange={(e) => setValorConta(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00C896 0%, #00C896 ${((valorConta - 100) / 4900) * 100}%, #E2E8F0 ${((valorConta - 100) / 4900) * 100}%, #E2E8F0 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>R$ 100</span>
                  <span>R$ 5.000</span>
                </div>
              </div>

              {/* Percentual de desconto */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="label mb-0">
                    Desconto estimado (faixa média: 20% a 35%)
                  </label>
                  <span className="text-2xl font-bold text-energy-500">
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
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00C896 0%, #00C896 ${((desconto - 10) / 30) * 100}%, #E2E8F0 ${((desconto - 10) / 30) * 100}%, #E2E8F0 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10%</span>
                  <span className="text-energy-500 font-semibold">Faixa ideal: 20%–35%</span>
                  <span>40%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-navy to-blue-900 rounded-xl">
              {[
                { label: "Economia / mês", value: fmt(economiaMensal) },
                { label: "Economia / ano", value: fmt(economiaAnual) },
                { label: "Economia / 5 anos", value: fmt(economia5Anos) },
              ].map((r) => (
                <div key={r.label} className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-energy-400">
                    {r.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{r.label}</div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 rounded-lg">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Esta é uma estimativa indicativa. A economia real depende do
                perfil de consumo, distribuidora, disponibilidade de energia
                ofertada e análise técnica individual.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link href="/economizar" className="btn-primary w-full sm:w-auto">
                Quero esse desconto
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
