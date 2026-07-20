import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  CircleDollarSign,
  Factory,
  FileSignature,
  Gauge,
  Network,
  Route,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"

const flow = [
  ["01", Factory, "Estruture a oferta", "O fornecedor cadastra entidade, usinas, distribuidoras e capacidade operacional mensal."],
  ["02", Users, "Organize a rede", "Parceiros registram prospects e unidades consumidoras com origem, consentimento e consumo."],
  ["03", Network, "Combine com critério", "O sistema exige a mesma distribuidora e respeita reservas, contratos e margem de segurança."],
  ["04", FileSignature, "Conduza à ativação", "Proposta, adesão, locação da quota, protocolo e comissão seguem uma linha do tempo."],
] as const

const faq = [
  ["A plataforma negocia créditos de energia?", "Não. A plataforma organiza capacidade, oportunidades e o fluxo de adesão e locação de quotas. A compensação é consequência regulatória da estrutura mantida pelo fornecedor."],
  ["Quem mantém a associação, cooperativa ou consórcio?", "O fornecedor e seus assessores respondem pela estrutura jurídica, regulatória, documental, fiscal e operacional. A plataforma oferece checklists, trilha e indicação de especialistas."],
  ["Como a compatibilidade é determinada?", "O primeiro bloqueio é a distribuidora: unidade consumidora e usina precisam estar na mesma área de concessão. Depois entram capacidade, consumo e qualificação."],
  ["Como a plataforma ganha dinheiro?", "A recomendação é combinar assinatura SaaS por fornecedor com taxa por unidade ativada. Implantação assistida e módulos adicionais complementam a receita."],
] as const

export default function PlatformLanding() {
  return (
    <div className="w-full overflow-x-clip bg-[#f4f6f1]">
      <section className="relative isolate overflow-hidden bg-[#071d19] pt-24 text-white sm:pt-28 xl:min-h-[92vh]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(178,255,73,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(178,255,73,.12)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -right-24 top-16 h-[520px] w-[520px] rounded-full border-[90px] border-[#b2ff49]/10" />
        <div className="relative mx-auto grid w-full min-w-0 max-w-7xl gap-14 px-5 pb-20 sm:px-8 sm:pb-24 xl:grid-cols-[1.08fr_.92fr] xl:items-center xl:gap-10 xl:px-10">
          <div className="min-w-0 pt-8 xl:pt-0">
            <div className="mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-[#b2ff49]/25 bg-[#b2ff49]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c8ff83] sm:text-xs sm:tracking-[0.18em]">
              <Route className="h-4 w-4" /> Infraestrutura comercial para GD compartilhada
            </div>
            <h1 className="max-w-3xl font-display text-[clamp(3rem,10vw,4.5rem)] font-semibold leading-[.95] tracking-[-.05em] xl:text-[5rem] 2xl:text-[5.3rem]">
              Capacidade que vira <span className="text-[#b2ff49]">contratos.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#bdd0c9] sm:text-xl">
              Fornecedores organizam usinas e kWh disponíveis. Parceiros conduzem possíveis associados da prospecção à ativação.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/fornecedor" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#b2ff49] px-6 py-3.5 text-sm font-bold text-[#071d19] transition hover:bg-white">
                Estruturar meu fornecedor <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/economizar" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold transition hover:bg-white/10">
                Cadastrar oportunidade
              </Link>
            </div>
            <div className="mt-10 flex max-w-xl items-start gap-3 border-l-2 border-[#b2ff49] pl-4 text-xs leading-5 text-[#90aaa1]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#b2ff49]" />
              Não comercializamos créditos. Cada fornecedor responde por sua entidade, contratos, enquadramento e operação regulatória.
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[570px] xl:mx-0 xl:justify-self-end xl:pl-8">
            <div className="absolute left-4 top-0 z-10 -translate-y-1/2 rounded-full bg-[#f0a340] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#2d1c06] shadow-xl sm:-left-2 xl:left-6">capacidade viva</div>
            <div className="rounded-[30px] border border-white/15 bg-[#0d2a24]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#90aaa1]">Usina Horizonte 02</p><p className="mt-1 text-sm">CEMIG · jul/2026</p></div>
                <BadgeCheck className="h-7 w-7 text-[#b2ff49]" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[["Operacional","240.000"],["Contratado","128.000"],["Reservado","22.000"],["Margem","12.000"]].map(([label, metric]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="font-display text-2xl font-semibold">{metric}</div><div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#90aaa1]">{label} kWh</div></div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-[#b2ff49] p-5 text-[#071d19]">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.14em]">Disponível agora</span><Gauge className="h-5 w-5" /></div>
                <div className="mt-2 font-display text-4xl font-semibold">78.000 kWh</div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#071d19]/15"><div className="h-full w-[67%] rounded-full bg-[#071d19]" /></div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-[#90aaa1]"><span>9 quotas ativas</span><span>3 reservas em 48h</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-5 md:grid-cols-4 md:divide-y-0">
          {[["Mesma distribuidora","regra nº 1"],["Reserva serializada","sem dupla alocação"],["Origem protegida","parceiro rastreado"],["Ponta a ponta","até a ativação"]].map(([metric, label]) => (
            <div key={metric} className="px-4 py-7 text-center"><div className="font-display text-base font-semibold text-slate-950">{metric}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{label}</div></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Uma operação coerente</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">Duas pontas. Uma linha do tempo.</h2><p className="mt-5 leading-7 text-slate-600">O produto não é uma vitrine de créditos. É o sistema operacional comercial da geração compartilhada.</p></div>
          <div className="grid gap-px overflow-hidden rounded-[28px] border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {flow.map(([number, Icon, title, text]) => (
              <div key={number} className="group bg-white p-7 transition hover:bg-[#eff7e8]"><div className="flex items-center justify-between"><span className="font-display text-4xl font-semibold text-slate-200 group-hover:text-emerald-300">{number}</span><Icon className="h-6 w-6 text-emerald-700" /></div><h3 className="mt-8 font-display text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e8eee3] py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="rounded-[30px] bg-[#071d19] p-8 text-white sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b2ff49] text-[#071d19]"><Check className="h-5 w-5" /></div><h2 className="mt-8 font-display text-3xl font-semibold">O que a plataforma faz</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-[#bdd0c9]">{["Qualificação operacional de fornecedores e usinas","Controle de capacidade, reservas e quotas","CRM de parceiros, prospects e unidades","Matching, proposta, adesão, ativação e comissões","Checklists e indicação de especialistas"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#b2ff49]" />{item}</li>)}</ul>
          </div>
          <div className="rounded-[30px] border border-slate-300 bg-white p-8 sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><ShieldCheck className="h-5 w-5" /></div><h2 className="mt-8 font-display text-3xl font-semibold text-slate-950">O que continua com o fornecedor</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">{["Constituição e manutenção da entidade","Regularidade das usinas e relação com a distribuidora","Instrumentos jurídicos, faturamento e cobrança","Listas e percentuais enviados à distribuidora","Obrigações regulatórias após a ativação"].map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Monetização recomendada</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-slate-950 sm:text-5xl">Receita por software e operação concluída.</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">O fornecedor paga pela infraestrutura que reduz trabalho, protege capacidade e acelera ativações.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[{ Icon: Building2, title: "Assinatura SaaS", text: "Mensalidade por fornecedor, com faixas por usinas, parceiros e unidades ativas." }, { Icon: CircleDollarSign, title: "Taxa de ativação", text: "Valor por unidade que chega ao status ativo, alinhando receita ao resultado." }, { Icon: BarChart3, title: "Módulos adicionais", text: "Onboarding assistido, assinatura eletrônica, relatórios e integrações." }].map((item, index) => (
            <div key={item.title} className={`rounded-[26px] border p-7 ${index === 1 ? "border-emerald-300 bg-[#eff7e8]" : "border-slate-200 bg-white"}`}><item.Icon className="h-6 w-6 text-emerald-700" /><h3 className="mt-8 font-display text-2xl font-semibold text-slate-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-10"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Sem zona cinzenta</p><h2 className="mt-4 font-display text-4xl font-semibold text-slate-950">Perguntas essenciais</h2></div><div className="space-y-3">{faq.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-[#fafbf8] p-5 open:border-emerald-300 open:bg-[#eff7e8]"><summary className="cursor-pointer list-none font-semibold text-slate-900">{question}</summary><p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div>
      </section>

      <section className="bg-[#071d19] py-20 text-white"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b2ff49]"><Zap className="h-4 w-4" /> Comece pelo fornecedor piloto</div><h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight">Uma distribuidora, uma usina e dez oportunidades reais.</h2></div><Link href="/fornecedor" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#b2ff49] px-6 py-3.5 text-sm font-bold text-[#071d19] transition hover:bg-white">Iniciar onboarding <ArrowRight className="h-4 w-4" /></Link></div></section>
    </div>
  )
}
