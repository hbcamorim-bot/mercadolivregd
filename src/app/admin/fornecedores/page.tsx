"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Phone,
  Mail,
  Zap,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Fornecedor } from "@/types";

const ALL_STATUSES = ["ATIVO", "EM_NEGOCIACAO", "PARCEIRO", "INATIVO"];

export default function AdminFornecedoresPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/fornecedores");
    if (res.status === 401) { router.push("/admin/login"); return; }
    setFornecedores(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch("/api/admin/fornecedores", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setUpdatingId(null);
  }

  const filtered = fornecedores.filter(
    (f) =>
      !search ||
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.regiaoAtuacao.toLowerCase().includes(search.toLowerCase())
  );

  const kwhTotal = filtered.reduce((s, f) => s + f.kwhDisponivel, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Fornecedores</h1>
          <p className="text-sm text-slate-500">{filtered.length} registros</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* KWh total */}
      <div className="bg-gradient-to-r from-navy to-navy-600 rounded-xl p-4 flex items-center gap-4 text-white">
        <div className="w-10 h-10 rounded-xl bg-energy-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-energy-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-energy-400">
            {new Intl.NumberFormat("pt-BR").format(kwhTotal)} kWh
          </div>
          <div className="text-xs text-slate-400">Volume total ofertado pelos fornecedores filtrados</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Buscar por nome, e-mail ou região..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-energy-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-energy-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-slate-400 border border-slate-100">
          Nenhum fornecedor encontrado
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Fornecedor</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">kWh Disponível</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Região</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Distribuidoras</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/fornecedores/${f.id}`}
                        className="font-medium text-energy-600 hover:text-energy-700 hover:underline"
                      >
                        {f.nome}
                      </Link>
                      <div className="text-slate-400 text-xs">{f.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-energy-600">
                        {new Intl.NumberFormat("pt-BR").format(f.kwhDisponivel)}
                      </div>
                      <div className="text-slate-400 text-xs">kWh/mês</div>
                    </td>
                    <td className="px-4 py-3">{f.regiaoAtuacao}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                      {f.distribuidoras}
                    </td>
                    <td className="px-4 py-3">
                      {updatingId === f.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-energy-500" />
                      ) : (
                        <select
                          value={f.status}
                          onChange={(e) => updateStatus(f.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-energy-400 focus:outline-none ${STATUS_COLORS[f.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDate(f.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${f.email}`}
                          title="E-mail"
                          className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${f.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${f.nome.split(" ")[0]}! Sou da equipe do Mercado Livre GD.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 text-slate-400 hover:text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
