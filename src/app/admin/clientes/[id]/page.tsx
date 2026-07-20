"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Save, Loader2, FileText, Contact2,
  Upload, Trash2, CheckCircle2, ExternalLink,
} from "lucide-react";
import { ESTADOS_BR, DISTRIBUIDORAS, STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Cliente } from "@/types";

const ALL_STATUSES = [
  "NOVO_CADASTRO", "DOCUMENTACAO_RECEBIDA", "EM_ANALISE",
  "FORNECEDOR_IDENTIFICADO", "PROPOSTA_EM_ANDAMENTO",
  "CONTATO_REALIZADO", "CONVERTIDO", "NAO_CONVERTIDO",
];

export default function ClienteDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingConta, setUploadingConta] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [deletingConta, setDeletingConta] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(false);
  const [form, setForm] = useState<Partial<Cliente>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/clientes/${id}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (!res.ok) { router.push("/admin/clientes"); return; }
    const data: Cliente = await res.json();
    setCliente(data);
    setForm(data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setCliente(updated);
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleFileUpload(tipo: "conta" | "documento", file: File) {
    const setter = tipo === "conta" ? setUploadingConta : setUploadingDoc;
    setter(true);
    const fd = new FormData();
    fd.append("tipo", tipo);
    fd.append("file", file);
    const res = await fetch(`/api/admin/clientes/${id}/files`, { method: "POST", body: fd });
    if (res.ok) {
      const updated = await res.json();
      setCliente(updated);
      setForm(updated);
    }
    setter(false);
  }

  async function handleFileDelete(tipo: "conta" | "documento") {
    const setter = tipo === "conta" ? setDeletingConta : setDeletingDoc;
    setter(true);
    const res = await fetch(`/api/admin/clientes/${id}/files`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCliente(updated);
      setForm(updated);
    }
    setter(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!cliente) return null;

  const inputCls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/clientes")}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{cliente.nome}</h1>
          <p className="text-xs text-slate-400">Cadastrado em {formatDate(cliente.createdAt)}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar alterações"}
        </button>
      </div>

      {/* Status + Observações */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Status da Negociação</h2>
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
              placeholder="Anotações sobre a negociação..."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Dados Pessoais</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Nome completo</label>
            <input name="nome" value={form.nome ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>CPF</label>
            <input name="cpf" value={form.cpf ?? ""} onChange={handleChange} className={inputCls} />
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

      {/* Endereço */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Endereço</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Endereço</label>
            <input name="endereco" value={form.endereco ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cidade</label>
            <input name="cidade" value={form.cidade ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Estado</label>
            <select name="estado" value={form.estado ?? ""} onChange={handleChange} className={inputCls}>
              <option value="">Selecione...</option>
              {ESTADOS_BR.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>CEP</label>
            <input name="cep" value={form.cep ?? ""} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Dados de energia */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Dados de Energia</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Distribuidora</label>
            <select name="distribuidora" value={form.distribuidora ?? ""} onChange={handleChange} className={inputCls}>
              <option value="">Selecione...</option>
              {DISTRIBUIDORAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Valor médio mensal (R$)</label>
            <input name="valorMedio" type="number" value={form.valorMedio ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Consumo médio (kWh)</label>
            <input name="consumoMedio" type="number" value={form.consumoMedio ?? ""} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Documentos</h2>
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Conta de energia */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-700">Conta de Energia</span>
            </div>
            {cliente.contaEnergiaUrl ? (
              <div className="flex items-center gap-2 mb-3">
                <a
                  href={cliente.contaEnergiaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver arquivo enviado
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-3">Nenhum arquivo enviado</p>
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-600 border border-brand-200 rounded-lg cursor-pointer hover:bg-brand-50 transition-colors">
                {uploadingConta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {cliente.contaEnergiaUrl ? "Substituir" : "Anexar"}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("conta", f); }} />
              </label>
              {cliente.contaEnergiaUrl && (
                <button
                  onClick={() => handleFileDelete("conta")}
                  disabled={deletingConta}
                  className="px-3 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingConta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Documento (CNH/RG) */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Contact2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700">Documento (CNH / RG)</span>
            </div>
            {cliente.documentoUrl ? (
              <div className="flex items-center gap-2 mb-3">
                <a
                  href={cliente.documentoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver arquivo enviado
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-3">Nenhum arquivo enviado</p>
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-600 border border-brand-200 rounded-lg cursor-pointer hover:bg-brand-50 transition-colors">
                {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {cliente.documentoUrl ? "Substituir" : "Anexar"}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("documento", f); }} />
              </label>
              {cliente.documentoUrl && (
                <button
                  onClick={() => handleFileDelete("documento")}
                  disabled={deletingDoc}
                  className="px-3 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Salvar (bottom) */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
