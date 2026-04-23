"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Info } from "lucide-react";
import { ESTADOS_BR, DISTRIBUIDORAS } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(3, "Nome ou razão social é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  kwhDisponivel: z.coerce.number().min(1, "Informe o volume de kWh disponível"),
  distribuidoras: z.string().min(2, "Informe a distribuidora"),
  regiaoAtuacao: z.string().min(2, "Informe a região de atuação"),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  faixaDesconto: z.string().optional(),
  perfilCliente: z.string().optional(),
  tipoOferta: z.string().optional(),
  prazoDisponibilidade: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function FornecedorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
        <h2 className="text-2xl font-bold text-navy mb-3">Cadastro recebido!</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Nossa equipe analisará as informações e entrará em contato em até 2 dias úteis
          para discutir oportunidades de negociação.
        </p>
      </div>
    );
  }

  const inputCls = "input-field";
  const labelCls = "label";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Cadastre sua disponibilidade de energia para que possamos conectar sua oferta
          a clientes compatíveis com perfil, localização e distribuidora.
        </p>
      </div>

      {/* Dados do fornecedor */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">1</span>
          Dados do fornecedor
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Nome da empresa ou responsável *</label>
            <input {...register("nome")} placeholder="Empresa Solar Ltda." className={inputCls} />
            {errors.nome && <p className="form-error">{errors.nome.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Telefone / WhatsApp *</label>
            <input {...register("telefone")} placeholder="(11) 99999-9999" className={inputCls} />
            {errors.telefone && <p className="form-error">{errors.telefone.message}</p>}
          </div>
          <div>
            <label className={labelCls}>E-mail *</label>
            <input {...register("email")} type="email" placeholder="contato@empresa.com.br" className={inputCls} />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Cidade</label>
            <input {...register("cidade")} placeholder="São Paulo" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Estado</label>
            <select {...register("estado")} className={inputCls}>
              <option value="">Selecione...</option>
              {ESTADOS_BR.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Oferta de energia */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">2</span>
          Sua oferta de energia
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Volume disponível (kWh/mês) *</label>
            <input {...register("kwhDisponivel")} type="number" min="1" placeholder="Ex: 100000" className={inputCls} />
            {errors.kwhDisponivel && <p className="form-error">{errors.kwhDisponivel.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Faixa de desconto ofertada</label>
            <select {...register("faixaDesconto")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="10-15%">10% a 15%</option>
              <option value="15-20%">15% a 20%</option>
              <option value="20-25%">20% a 25%</option>
              <option value="25-30%">25% a 30%</option>
              <option value="30%+">Acima de 30%</option>
              <option value="A negociar">A negociar</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Distribuidora(s) atendida(s) *</label>
            <select {...register("distribuidoras")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Todas">Múltiplas distribuidoras</option>
              {DISTRIBUIDORAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.distribuidoras && <p className="form-error">{errors.distribuidoras.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Região de atuação *</label>
            <select {...register("regiaoAtuacao")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Nacional">Nacional (todo o Brasil)</option>
              <option value="Sul">Sul (PR, SC, RS)</option>
              <option value="Sudeste">Sudeste (SP, RJ, MG, ES)</option>
              <option value="Norte">Norte (AM, PA, AC, RO, RR, AP, TO)</option>
              <option value="Nordeste">Nordeste (BA, SE, AL, PE, PB, RN, CE, PI, MA)</option>
              <option value="Centro-Oeste">Centro-Oeste (GO, MT, MS, DF)</option>
              {ESTADOS_BR.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            {errors.regiaoAtuacao && <p className="form-error">{errors.regiaoAtuacao.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Tipo / modalidade da oferta</label>
            <select {...register("tipoOferta")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Geração Distribuída (GD)">Geração Distribuída (GD)</option>
              <option value="Mercado Livre (ACL)">Mercado Livre (ACL)</option>
              <option value="Autoprodução">Autoprodução</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Perfil de cliente desejado</label>
            <select {...register("perfilCliente")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Condomínio">Condomínio</option>
              <option value="Qualquer perfil">Qualquer perfil</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Prazo / disponibilidade</label>
            <select {...register("prazoDisponibilidade")} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Imediato">Imediato</option>
              <option value="1-3 meses">1 a 3 meses</option>
              <option value="3-6 meses">3 a 6 meses</option>
              <option value="A partir de 6 meses">A partir de 6 meses</option>
              <option value="A definir">A definir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="card">
        <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">3</span>
          Observações — opcional
        </h2>
        <textarea
          {...register("observacoes")}
          rows={3}
          placeholder="Informações adicionais sobre sua oferta, condições especiais, contratos mínimos..."
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Enviando...</>
        ) : (
          "Cadastrar energia disponível"
        )}
      </button>
    </form>
  );
}
