"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";

const schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().min(10, "Mensagem muito curta"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormData) {
    setLoading(true);
    const msg = `Olá! Mensagem pelo site MercadolivreGD.com\n\n*Nome:* ${data.nome}\n*E-mail:* ${data.email}\n*Telefone:* ${data.telefone}\n*Assunto:* ${data.assunto}\n\n*Mensagem:*\n${data.mensagem}`;
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setTimeout(() => { setLoading(false); setSent(true); }, 500);
  }

  if (sent) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 rounded-full bg-energy-50 flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-energy-500" />
        </div>
        <h3 className="text-xl font-bold text-navy mb-2">Mensagem enviada!</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          O WhatsApp foi aberto com sua mensagem. Nossa equipe responderá em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <h3 className="font-bold text-navy text-lg mb-2">Envie sua mensagem</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Nome *</label>
          <input {...register("nome")} placeholder="Seu nome" className="input-field" />
          {errors.nome && <p className="form-error">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="label">Telefone / WhatsApp *</label>
          <input {...register("telefone")} placeholder="(11) 99999-9999" className="input-field" />
          {errors.telefone && <p className="form-error">{errors.telefone.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">E-mail *</label>
          <input {...register("email")} type="email" placeholder="voce@email.com" className="input-field" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Assunto *</label>
          <select {...register("assunto")} className="input-field">
            <option value="">Selecione...</option>
            <option value="Quero economizar na conta de energia">Quero economizar na conta de energia</option>
            <option value="Sou fornecedor de energia">Sou fornecedor de energia</option>
            <option value="Dúvida sobre o processo">Dúvida sobre o processo</option>
            <option value="Parceria comercial">Parceria comercial</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.assunto && <p className="form-error">{errors.assunto.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Mensagem *</label>
          <textarea
            {...register("mensagem")}
            rows={4}
            placeholder="Descreva sua dúvida ou situação..."
            className="input-field resize-none"
          />
          {errors.mensagem && <p className="form-error">{errors.mensagem.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Abrindo WhatsApp...</>
        ) : (
          <><Send className="w-4 h-4" />Enviar mensagem</>
        )}
      </button>
      <p className="text-xs text-slate-400 text-center">
        Ao enviar, sua mensagem será encaminhada via WhatsApp para nossa equipe.
      </p>
    </form>
  );
}
