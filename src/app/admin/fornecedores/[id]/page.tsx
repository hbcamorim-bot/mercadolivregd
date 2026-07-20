"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Save, Loader2, CheckCircle2,
} from "lucide-react";
import { ESTADOS_BR, DISTRIBUIDORAS, STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Fornecedor } from "@/types";

const ALL_STATUSES = ["NOVO_ONBOARDING", "ATIVO", "EM_NEGOCIACAO", "PARCEIRO", "INATIVO"];

export default function FornecedorDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Partial<Fornecedor>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/fornecedores/${id}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (!res.ok) { router.push("/admin/fornecedores"); return; }
    const data: Fornecedor = await res.json();
    setFornecedor(data);
    setForm(data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/fornecedores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setFornecedor(updated);
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-energy-500" />
      </div>
    );
  }

  if (!fornecedor) return null;

  const inputCls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-energy-400 bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

  const SaveButton = ({ full }: { full?: boolean }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-2 px-4 py-2.5 bg-energy-500 text-white text-sm font-semibold rounded-lg hover:bg-energy-600 disabled:opacity-60 transition-colors ${full ? "w-full justify-center" : ""}`}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar alterações"}
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/fornecedores")}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{fornecedor.nome}</h1>
          <p className="text-xs text-slate-400">Cadastrado em {formatDate(fornecedor.createdAt)}</p>
        </div>
        <SaveButton />
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Status do Fornecedor</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" value={form.status ?? ""} onChange={handleChange} className={inputCls}>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            {form.status && (
              <span className={`badge mt-2 ${STATUS_COLORS[form.status] ?? ""}`}>
                {STATUS_LABELS[form.status]}
              </span>
            )}
          </div>
          <div>
            <label className={labelCls}>Observações internas</label>
            <textarea
              name="observacoes"
              value={form.observacoes ?? ""}
              onChange={handleChange}
              rows={3}
              placeholder="Anotações sobre o fornecedor..."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Dados do fornecedor */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Dados do Fornecedor</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Nome da empresa / responsável</label>
            <input name="nome" value={form.nome ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>E-mail</label>
            <input name="email" type="email" value={form.email ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Telefone / WhatsApp</label>
            <input name="telefone" value={form.telefone ?? ""} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Dados de oferta */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Oferta de Energia</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Volume disponível (kWh/mês)</label>
            <input
              name="kwhDisponivel"
              type="number"
              min="0"
              value={form.kwhDisponivel ?? ""}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Região de atuação</label>
            <select name="regiaoAtuacao" value={form.regiaoAtuacao ?? ""} onChange={handleChange} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Nacional">Nacional (todo o Brasil)</option>
              <option value="Sul">Sul (PR, SC, RS)</option>
              <option value="Sudeste">Sudeste (SP, RJ, MG, ES)</option>
              <option value="Norte">Norte (AM, PA, AC, RO, RR, AP, TO)</option>
              <option value="Nordeste">Nordeste (BA, SE, AL, PE, PB, RN, CE, PI, MA)</option>
              <option value="Centro-Oeste">Centro-Oeste (GO, MT, MS, DF)</option>
              {ESTADOS_BR.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Distribuidora(s) atendida(s)</label>
            <select name="distribuidoras" value={form.distribuidoras ?? ""} onChange={handleChange} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Todas">Múltiplas distribuidoras</option>
              {DISTRIBUIDORAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Salvar (bottom) */}
      <div className="flex justify-end pb-6">
        <SaveButton />
      </div>
    </div>
  );
}
