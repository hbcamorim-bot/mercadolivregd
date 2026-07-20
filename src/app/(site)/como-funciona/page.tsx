import type { Metadata } from "next"
import { BadgeCheck, Factory, FileSignature, Gauge, Network, Route, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Fluxo operacional",
  description: "Entenda como fornecedores, parceiros, prospects, usinas e quotas percorrem o fluxo até a ativação.",
}

const steps = [
  [Factory, "Fornecedor e entidade", "Cadastro da organização responsável e de sua associação, cooperativa ou consórcio."],
  [Gauge, "Usinas e capacidade", "Cada usina registra distribuidora, geração operacional, contratos, reservas e margem mensal."],
  [Users, "Parceiros e prospects", "A origem comercial, o consentimento e as unidades consumidoras ficam rastreáveis."],
  [Network, "Matching", "Apenas usinas operacionais da mesma distribuidora entram como opção para a unidade."],
  [FileSignature, "Adesão e locação", "Proposta aceita inicia adesão à entidade e instrumento de locação da quota da usina."],
  [BadgeCheck, "Protocolo e ativação", "O fornecedor conduz documentos e distribuidora; o sistema registra marcos e libera comissão."],
] as const

export default function HowItWorksPage() {
  return (
    <div className="bg-[#f4f6f1] pt-20">
      <section className="bg-[#071d19] py-20 text-white"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b2ff49]"><Route className="h-4 w-4" /> Fluxo operacional</div><h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Uma trilha única do ativo gerador à unidade ativada.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#bdd0c9]">A plataforma coordena informação e trabalho. A constituição jurídica, os contratos e a operação regulatória continuam sob responsabilidade do fornecedor.</p></div></section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{steps.map(([Icon,title,text], index) => <article key={title} className="rounded-[26px] border border-slate-200 bg-white p-7"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-emerald-700" /><span className="font-display text-3xl font-semibold text-slate-200">0{index+1}</span></div><h2 className="mt-10 font-display text-2xl font-semibold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div><div className="mt-8 rounded-[26px] border border-amber-200 bg-amber-50 p-7"><h2 className="font-display text-2xl font-semibold text-amber-950">O sistema apoia; o fornecedor executa.</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-amber-900">Podemos oferecer modelos de checklist, organizar pendências e indicar assessorias. Não constituímos automaticamente a entidade, não substituímos análise jurídica ou regulatória e não enviamos informações à distribuidora sem o fluxo operacional definido pelo fornecedor.</p></div></section>
    </div>
  )
}
