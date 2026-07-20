"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ESTADOS_BR, DISTRIBUIDORAS } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(3, "Nome ou razão social é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  kwhDisponivel: z.coerce.number().min(1, "Informe o volume de kWh disponível"),
  regiaoAtuacao: z.string().min(2, "Informe a região de atuação"),
  distribuidoras: z.string().min(2, "Informe a distribuidora"),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function FornecedorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
          Cadastro recebido!
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Nossa equipe analisará a estrutura informada e entrará em contato
          para organizar entidade, usinas, capacidade e regras comerciais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6">
          Dados do Fornecedor
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Nome da empresa ou responsável *</label>
            <input
              {...register("nome")}
              placeholder="Empresa Solar Ltda."
              className="input-field"
            />
            {errors.nome && <p className="form-error">{errors.nome.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">E-mail *</label>
              <input
                {...register("email")}
                type="email"
                placeholder="contato@empresa.com.br"
                className="input-field"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Telefone / WhatsApp *</label>
              <input
                {...register("telefone")}
                placeholder="(11) 99999-9999"
                className="input-field"
              />
              {errors.telefone && <p className="form-error">{errors.telefone.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Capacidade mensal estimada disponível (kWh) *</label>
            <input
              {...register("kwhDisponivel")}
              type="number"
              min="1"
              placeholder="Ex: 100000"
              className="input-field"
            />
            {errors.kwhDisponivel && <p className="form-error">{errors.kwhDisponivel.message}</p>}
          </div>

          <div>
            <label className="label">Região de atuação (estados) *</label>
            <select {...register("regiaoAtuacao")} className="input-field">
              <option value="">Selecione o estado principal</option>
              <option value="Nacional">Nacional (todo o Brasil)</option>
              <option value="Sul">Sul (PR, SC, RS)</option>
              <option value="Sudeste">Sudeste (SP, RJ, MG, ES)</option>
              <option value="Norte">Norte (AM, PA, AC, RO, RR, AP, TO)</option>
              <option value="Nordeste">Nordeste (BA, SE, AL, PE, PB, RN, CE, PI, MA)</option>
              <option value="Centro-Oeste">Centro-Oeste (GO, MT, MS, DF)</option>
              {ESTADOS_BR.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {errors.regiaoAtuacao && <p className="form-error">{errors.regiaoAtuacao.message}</p>}
          </div>

          <div>
            <label className="label">Distribuidora(s) atendida(s) *</label>
            <select {...register("distribuidoras")} className="input-field">
              <option value="">Selecione...</option>
              <option value="Todas">Múltiplas distribuidoras</option>
              {DISTRIBUIDORAS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.distribuidoras && <p className="form-error">{errors.distribuidoras.message}</p>}
          </div>

          <div>
            <label className="label">Observações comerciais (opcional)</label>
            <textarea
              {...register("observacoes")}
              rows={3}
              placeholder="Usinas, entidade, situação documental, capacidade e distribuidoras..."
              className="input-field resize-none"
            />
          </div>
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
          "Solicitar onboarding"
        )}
      </button>
    </form>
  );
}
