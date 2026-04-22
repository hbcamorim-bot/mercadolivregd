"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload, Info } from "lucide-react";
import { ESTADOS_BR, DISTRIBUIDORAS } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  distribuidora: z.string().min(2, "Distribuidora é obrigatória"),
  valorMedio: z.coerce.number().min(50, "Informe o valor médio da conta"),
  consumoMedio: z.coerce.number().optional(),
  aceiteLgpd: z.boolean().refine((v) => v, "Aceite obrigatório"),
  aceitePrivacidade: z.boolean().refine((v) => v, "Aceite obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function ClienteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contaFile, setContaFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => body.append(k, String(v)));
      if (contaFile) body.append("contaEnergia", contaFile);
      if (docFile) body.append("documento", docFile);

      const res = await fetch("/api/clientes", { method: "POST", body });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Erro ao enviar cadastro");
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-energy-50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-energy-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-navy mb-3">
          Cadastro recebido com sucesso!
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Nossa equipe analisará seu perfil e entrará em contato por e-mail e
          WhatsApp em até 2 dias úteis com as opções disponíveis para você.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Dados pessoais */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-energy-500 text-white text-xs font-bold flex items-center justify-center">1</span>
          Dados Pessoais
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nome completo do titular *</label>
            <input {...register("nome")} placeholder="João da Silva" className="input-field" />
            {errors.nome && <p className="form-error">{errors.nome.message}</p>}
          </div>
          <div>
            <label className="label">CPF *</label>
            <input {...register("cpf")} placeholder="000.000.000-00" className="input-field" />
            {errors.cpf && <p className="form-error">{errors.cpf.message}</p>}
          </div>
          <div>
            <label className="label">E-mail *</label>
            <input {...register("email")} type="email" placeholder="joao@email.com" className="input-field" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Telefone / WhatsApp *</label>
            <input {...register("telefone")} placeholder="(11) 99999-9999" className="input-field" />
            {errors.telefone && <p className="form-error">{errors.telefone.message}</p>}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-energy-500 text-white text-xs font-bold flex items-center justify-center">2</span>
          Endereço
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Endereço completo *</label>
            <input {...register("endereco")} placeholder="Rua, número, complemento, bairro" className="input-field" />
            {errors.endereco && <p className="form-error">{errors.endereco.message}</p>}
          </div>
          <div>
            <label className="label">Cidade *</label>
            <input {...register("cidade")} placeholder="São Paulo" className="input-field" />
            {errors.cidade && <p className="form-error">{errors.cidade.message}</p>}
          </div>
          <div>
            <label className="label">Estado *</label>
            <select {...register("estado")} className="input-field">
              <option value="">Selecione...</option>
              {ESTADOS_BR.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {errors.estado && <p className="form-error">{errors.estado.message}</p>}
          </div>
          <div>
            <label className="label">CEP *</label>
            <input {...register("cep")} placeholder="00000-000" className="input-field" />
            {errors.cep && <p className="form-error">{errors.cep.message}</p>}
          </div>
        </div>
      </div>

      {/* Dados de energia */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-energy-500 text-white text-xs font-bold flex items-center justify-center">3</span>
          Dados de Energia
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Distribuidora de energia *</label>
            <select {...register("distribuidora")} className="input-field">
              <option value="">Selecione...</option>
              {DISTRIBUIDORAS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.distribuidora && <p className="form-error">{errors.distribuidora.message}</p>}
          </div>
          <div>
            <label className="label">Valor médio mensal da conta (R$) *</label>
            <input {...register("valorMedio")} type="number" min="0" step="10" placeholder="500" className="input-field" />
            {errors.valorMedio && <p className="form-error">{errors.valorMedio.message}</p>}
          </div>
          <div>
            <label className="label">Consumo médio mensal (kWh) — opcional</label>
            <input {...register("consumoMedio")} type="number" min="0" placeholder="400" className="input-field" />
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-2 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-energy-500 text-white text-xs font-bold flex items-center justify-center">4</span>
          Documentos
        </h2>
        <div className="flex items-start gap-2 mb-5 p-3 bg-blue-50 rounded-lg">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Os documentos são necessários para verificar a titularidade da conta,
            a distribuidora e o histórico de consumo. Eles são tratados com
            confidencialidade e usados exclusivamente para análise técnica.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Conta de energia (PDF ou imagem)</label>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-energy-400 hover:bg-energy-50 transition-all">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                {contaFile ? contaFile.name : "Clique para anexar"}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — máx. 5MB</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setContaFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div>
            <label className="label">CNH ou RG do titular</label>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-energy-400 hover:bg-energy-50 transition-all">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                {docFile ? docFile.name : "Clique para anexar"}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — máx. 5MB</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* LGPD */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-energy-500 text-white text-xs font-bold flex items-center justify-center">5</span>
          Consentimento e Privacidade
        </h2>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("aceiteLgpd")}
              className="mt-0.5 w-4 h-4 accent-energy-500"
            />
            <span className="text-sm text-slate-600">
              Autorizo o tratamento dos meus dados pessoais para fins de análise
              e contato comercial, conforme a{" "}
              <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. *
            </span>
          </label>
          {errors.aceiteLgpd && <p className="form-error pl-7">{errors.aceiteLgpd.message}</p>}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("aceitePrivacidade")}
              className="mt-0.5 w-4 h-4 accent-energy-500"
            />
            <span className="text-sm text-slate-600">
              Li e aceito a{" "}
              <a href="/politica-privacidade" target="_blank" className="text-energy-600 hover:underline font-medium">
                Política de Privacidade
              </a>{" "}
              da plataforma. *
            </span>
          </label>
          {errors.aceitePrivacidade && <p className="form-error pl-7">{errors.aceitePrivacidade.message}</p>}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando cadastro...
          </>
        ) : (
          "Enviar Cadastro e Quero Economizar"
        )}
      </button>
    </form>
  );
}
