"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Phone,
  Mail,
  FileText,
  Contact2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, ESTADOS_BR, formatCurrency, formatDate } from "@/lib/utils";
import type { Cliente } from "@/types";

const ALL_STATUSES = [
  "NOVO_CADASTRO",
  "DOCUMENTACAO_RECEBIDA",
  "EM_ANALISE",
  "FORNECEDOR_IDENTIFICADO",
  "PROPOSTA_EM_ANDAMENTO",
  "CONTATO_REALIZADO",
  "CONVERTIDO",
  "NAO_CONVERTIDO",
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";

export default function AdminClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterEstado) params.set("estado", filterEstado);
    const res = await fetch(`/api/admin/clientes?${params}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    setClientes(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [filterStatus, filterEstado]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch("/api/admin/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setUpdatingId(null);
  }

  const filtered = clientes.filter(
    (c) =>
      !search ||
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.cidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500">{filtered.length} registros</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Buscar por nome, e-mail ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="">Todos os estados</option>
          {ESTADOS_BR.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-slate-400 border border-slate-100">
          Nenhum cliente encontrado
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Localização</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Energia</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        {c.nome}
                      </Link>
                      <div className="text-slate-400 text-xs">{c.cpf}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{c.cidade} — {c.estado}</div>
                      <div className="text-slate-400 text-xs">{c.distribuidora}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{formatCurrency(c.valorMedio)}<span className="text-slate-400 font-normal">/mês</span></div>
                      {c.consumoMedio && <div className="text-slate-400 text-xs">{c.consumoMedio} kWh</div>}
                    </td>
                    <td className="px-4 py-3">
                      {updatingId === c.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                      ) : (
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-brand-400 focus:outline-none ${STATUS_COLORS[c.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${c.email}`}
                          title="Enviar e-mail"
                          className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${c.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${c.nome.split(" ")[0]}! Sou da equipe do Mercado Livre GD.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 text-slate-400 hover:text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        {c.contaEnergiaUrl ? (
                          <a
                            href={c.contaEnergiaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver conta de energia"
                            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        ) : (
                          <span title="Conta de energia não enviada" className="p-1.5 text-slate-200 rounded-lg cursor-default">
                            <FileText className="w-4 h-4" />
                          </span>
                        )}
                        {c.documentoUrl ? (
                          <a
                            href={c.documentoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver documento (CNH/RG)"
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Contact2 className="w-4 h-4" />
                          </a>
                        ) : (
                          <span title="Documento não enviado" className="p-1.5 text-slate-200 rounded-lg cursor-default">
                            <Contact2 className="w-4 h-4" />
                          </span>
                        )}
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
