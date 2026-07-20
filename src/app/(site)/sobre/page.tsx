import type { Metadata } from "next"
import { CircleDollarSign, Compass, ShieldCheck } from "lucide-react"

export const metadata: Metadata = { title: "Modelo da plataforma", description: "Posicionamento, responsabilidades e modelo de receita do Mercado Livre GD." }

const pillars = [
  [Compass, "Coordenação", "Uma fonte única de verdade para capacidade, oportunidades, contratos e ativações."],
  [ShieldCheck, "Delimitação", "O fornecedor mantém a responsabilidade por estrutura, documentos e operação regulatória."],
  [CircleDollarSign, "Alinhamento", "A receita vem do software e da eficiência operacional, não da compra e venda de créditos."],
] as const

export default function AboutPage() {
  return <div className="bg-[#f4f6f1] pt-20"><section className="bg-[#071d19] py-20 text-white"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b2ff49]">Nosso papel</p><h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Infraestrutura de operação, não balcão de créditos.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#bdd0c9]">O Mercado Livre GD organiza o caminho comercial da geração compartilhada: ativo, capacidade, canal, prospect, quota, contrato e ativação.</p></div></section><section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10"><div className="grid gap-5 md:grid-cols-3">{pillars.map(([Icon,title,text]) => <article key={title} className="rounded-[26px] border border-slate-200 bg-white p-7"><Icon className="h-6 w-6 text-emerald-700" /><h2 className="mt-8 font-display text-2xl font-semibold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div><div className="mt-10 grid gap-6 rounded-[30px] bg-[#e8eee3] p-8 lg:grid-cols-2 lg:p-10"><div><h2 className="font-display text-3xl font-semibold text-slate-950">Tese de produto</h2><p className="mt-4 text-sm leading-7 text-slate-600">Fornecedores não precisam de mais leads soltos; precisam de previsibilidade sobre qual capacidade existe, quem originou cada oportunidade e onde cada unidade está no processo.</p></div><div><h2 className="font-display text-3xl font-semibold text-slate-950">Tese de receita</h2><p className="mt-4 text-sm leading-7 text-slate-600">Assinatura SaaS cria recorrência. A taxa por ativação alinha incentivos. Serviços de implantação e integrações aumentam ticket sem transformar a plataforma em parte da estrutura jurídica do fornecedor.</p></div></div></section></div>
}
