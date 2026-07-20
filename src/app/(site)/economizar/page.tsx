import type { Metadata } from "next"
import { FileCheck, Gauge, Lock, Network } from "lucide-react"
import ClienteForm from "./ClienteForm"

export const metadata: Metadata = {
  title: "Pré-cadastro de oportunidade",
  description: "Cadastre uma unidade consumidora para análise de compatibilidade com uma estrutura de geração compartilhada.",
}

const points = [
  [Lock, "Consentimento e origem registrados"],
  [Network, "Matching na mesma distribuidora"],
  [Gauge, "Quota dimensionada pelo consumo"],
  [FileCheck, "Adesão e contrato antes da ativação"],
] as const

export default function EconomizarPage() {
  return (
    <div className="bg-[#f4f6f1] pt-20">
      <section className="relative overflow-hidden bg-[#071d19] py-20 text-white"><div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(178,255,73,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(178,255,73,.12)_1px,transparent_1px)] [background-size:64px_64px]" /><div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b2ff49]">Oportunidade comercial</span><h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Cadastre a unidade para uma análise de compatibilidade.</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#bdd0c9]">O cadastro não garante adesão ou economia. Primeiro verificamos distribuidora, consumo, capacidade disponível e estrutura do fornecedor.</p><div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">{points.map(([Icon, text]) => <div key={text} className="rounded-2xl border border-white/10 bg-white/[.05] p-4 text-left"><Icon className="h-5 w-5 text-[#b2ff49]" /><p className="mt-4 text-xs leading-5 text-[#bdd0c9]">{text}</p></div>)}</div></div></section>
      <section className="py-14"><div className="mx-auto max-w-3xl px-5 sm:px-8"><div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">Use este formulário somente com ciência do titular. No painel operacional, o parceiro responsável e a versão do consentimento ficam vinculados à oportunidade.</div><ClienteForm /></div></section>
    </div>
  )
}
