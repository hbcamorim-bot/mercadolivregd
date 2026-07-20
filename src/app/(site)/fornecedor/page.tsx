import type { Metadata } from "next"
import { Factory, Gauge, Network, ShieldCheck } from "lucide-react"
import FornecedorForm from "./FornecedorForm"

export const metadata: Metadata = {
  title: "Onboarding de fornecedor GD",
  description: "Inicie a estruturação comercial de suas usinas e da capacidade disponível para locação de quotas.",
}

const points = [
  [Factory, "Múltiplas usinas por fornecedor"],
  [Gauge, "Capacidade mensal controlada"],
  [Network, "Rede de parceiros rastreável"],
  [ShieldCheck, "Responsabilidades delimitadas"],
] as const

export default function FornecedorPage() {
  return (
    <div className="bg-[#f4f6f1] pt-20">
      <section className="relative overflow-hidden bg-[#071d19] py-20 text-white">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(178,255,73,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(178,255,73,.12)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b2ff49]">Onboarding inicial</span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Transforme capacidade disponível em uma operação comercial organizada.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#bdd0c9]">Este é um pré-cadastro. Depois validaremos entidade, usinas, distribuidora, documentos e regras comerciais antes de qualquer matching.</p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">{points.map(([Icon, text]) => <div key={text} className="rounded-2xl border border-white/10 bg-white/[.05] p-4 text-left"><Icon className="h-5 w-5 text-[#b2ff49]" /><p className="mt-4 text-xs leading-5 text-[#bdd0c9]">{text}</p></div>)}</div>
        </div>
      </section>
      <section className="py-14"><div className="mx-auto max-w-2xl px-5 sm:px-8"><div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Importante:</strong> o fornecedor permanece responsável por sua estrutura jurídica, regulatória, contratual, fiscal e operacional. A plataforma organiza o fluxo e pode indicar caminhos e especialistas.</div><FornecedorForm /></div></section>
    </div>
  )
}
