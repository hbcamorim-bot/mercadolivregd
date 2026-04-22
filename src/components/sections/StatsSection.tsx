import { TrendingDown, Users, Zap, Globe } from "lucide-react";

const STATS = [
  { icon: TrendingDown, value: "Até 35%", label: "de desconto real na conta de luz" },
  { icon: Users, value: "2 públicos", label: "clientes e fornecedores conectados" },
  { icon: Zap, value: "GD limpa", label: "energia solar, eólica e renovável" },
  { icon: Globe, value: "Todo Brasil", label: "atendimento nacional" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-energy-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
