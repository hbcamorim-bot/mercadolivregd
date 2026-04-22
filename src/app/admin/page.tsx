"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

const fmtNum = (v: number) =>
  new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(v);

const PIE_COLORS = ["#00C896", "#1A6EC8", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#84CC16", "#F97316"];

const KPI_CARDS = (s: DashboardStats) => [
  {
    icon: Users,
    label: "Clientes Cadastrados",
    value: s.totalClientes,
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: Building2,
    label: "Fornecedores Ativos",
    value: s.totalFornecedores,
    color: "text-energy-600",
    bg: "bg-energy-50",
  },
  {
    icon: Zap,
    label: "Total kWh Ofertado",
    value: fmtNum(s.kwhTotal ?? 0),
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: TrendingUp,
    label: "Negociações Ativas",
    value: s.negociacoesAtivas,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: CheckCircle2,
    label: "Convertidos",
    value: s.convertidos,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: TrendingDown,
    label: "Taxa de Conversão",
    value: `${(s.taxaConversao ?? 0).toFixed(1)}%`,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setStats({
          totalClientes: 0, totalFornecedores: 0, kwhTotal: 0,
          negociacoesAtivas: 0, convertidos: 0, taxaConversao: 0,
          economiaPotencial: 0, clientesPorStatus: [], cadastrosPorMes: [],
        });
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStats({
        totalClientes: data.totalClientes ?? 0,
        totalFornecedores: data.totalFornecedores ?? 0,
        kwhTotal: data.kwhTotal ?? 0,
        negociacoesAtivas: data.negociacoesAtivas ?? 0,
        convertidos: data.convertidos ?? 0,
        taxaConversao: data.taxaConversao ?? 0,
        economiaPotencial: data.economiaPotencial ?? 0,
        clientesPorStatus: data.clientesPorStatus ?? [],
        cadastrosPorMes: data.cadastrosPorMes ?? [],
      });
    } catch {
      setStats({
        totalClientes: 0, totalFornecedores: 0, kwhTotal: 0,
        negociacoesAtivas: 0, convertidos: 0, taxaConversao: 0,
        economiaPotencial: 0, clientesPorStatus: [], cadastrosPorMes: [],
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-energy-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral da plataforma</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS(stats).map((k) => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800 leading-none mb-1">
              {k.value}
            </div>
            <div className="text-xs text-slate-500 leading-tight">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Economia potencial */}
      <div className="bg-gradient-to-r from-navy to-navy-600 rounded-xl p-5 text-white">
        <p className="text-sm text-slate-400 mb-1">Economia potencial anual estimada (base: 25% de desconto)</p>
        <p className="text-3xl font-bold text-energy-400">{fmt(stats.economiaPotencial)}</p>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cadastros por mês */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Cadastros por mês</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.cadastrosPorMes} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="clientes" name="Clientes" fill="#1A6EC8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fornecedores" name="Fornecedores" fill="#00C896" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status dos clientes */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Clientes por status</h3>
          {stats.clientesPorStatus.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
              Nenhum dado ainda
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.clientesPorStatus.map((s) => ({
                    name: STATUS_LABELS[s.status] ?? s.status,
                    value: s.count,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.clientesPorStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/admin/clientes"
          className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:border-brand-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-700">Gerenciar Clientes</div>
              <div className="text-sm text-slate-500">{stats.totalClientes} registros</div>
            </div>
            <Users className="w-8 h-8 text-brand-400 group-hover:text-brand-500" />
          </div>
        </a>
        <a
          href="/admin/fornecedores"
          className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:border-energy-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-700">Gerenciar Fornecedores</div>
              <div className="text-sm text-slate-500">{stats.totalFornecedores} registros</div>
            </div>
            <Building2 className="w-8 h-8 text-energy-400 group-hover:text-energy-500" />
          </div>
        </a>
      </div>
    </div>
  );
}
