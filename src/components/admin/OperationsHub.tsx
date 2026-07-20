"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  CircleDollarSign,
  Factory,
  Gauge,
  Handshake,
  Loader2,
  Network,
  Plus,
  RefreshCw,
  Route,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"

type SelectItem = { id: string; name: string }
type Utility = SelectItem & { code: string }
type Capacity = {
  id: string
  operationalKwh: string
  contractedKwh: string
  reservedKwh: string
  safetyMarginKwh: string
  availableKwh: string
}
type Plant = SelectItem & {
  supplierOrganizationId: string
  distributionUtilityId: string
  status: string
  qualificationStatus: string
  city: string
  state: string
  distributionUtility: Utility
  supplierOrganization: SelectItem
  sharedGenerationEntity: SelectItem
  capacityPeriods: Capacity[]
}
type Partner = SelectItem & {
  supplierOrganizationId: string
  email?: string
  status: string
  supplierOrganization: SelectItem
  _count: { prospects: number }
}
type Proposal = {
  id: string
  status: string
  version: number
  monthlyLeaseAmount: string
  quotaKwh: string
}
type Match = {
  id: string
  status: string
  suggestedKwh: string
  score: string
  plant: SelectItem
  reservation?: { id: string; status: string }
  proposals: Proposal[]
}
type ConsumerUnit = {
  id: string
  unitNumber: string
  distributionUtilityId: string
  averageMonthlyConsumptionKwh: string
  distributionUtility: Utility
  matches: Match[]
}
type Prospect = SelectItem & {
  supplierOrganizationId: string
  status: string
  currentCommercialPartner: SelectItem
  supplierOrganization: SelectItem
  consumerUnits: ConsumerUnit[]
}
type Agreement = {
  id: string
  status: string
  quotaKwh: string
  monthlyLeaseAmount: string
  plant: SelectItem
  consumerUnit: { id: string; unitNumber: string }
  activationProcess?: {
    id: string
    status: string
    protocolNumber?: string
  }
  proposal: { match: { consumerUnit: { prospect: Prospect } } }
}
type CommissionPolicy = {
  id: string
  name: string
  type: string
  fixedAmount?: string
  percentage?: string
  active: boolean
  supplierOrganization: SelectItem
}
type CommissionEntry = {
  id: string
  status: string
  amount: string
  competence: string
  commercialPartner: SelectItem
  prospect: SelectItem
}
type OperationsData = {
  summary: {
    suppliers: number
    plants: number
    operationalPlants: number
    partners: number
    prospects: number
    activeAgreements: number
    availableKwh: number
    reservedKwh: number
    pendingCommission: number
  }
  suppliers: SelectItem[]
  utilities: Utility[]
  entities: Array<SelectItem & { supplierOrganizationId: string; qualificationStatus: string }>
  plants: Plant[]
  partners: Partner[]
  prospects: Prospect[]
  agreements: Agreement[]
  commissionPolicies: CommissionPolicy[]
  commissionEntries: CommissionEntry[]
}

const TABS = [
  { id: "overview", label: "Visão geral", icon: Gauge },
  { id: "structure", label: "Estrutura", icon: Network },
  { id: "plants", label: "Usinas", icon: Factory },
  { id: "commercial", label: "Comercial", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Route },
  { id: "commission", label: "Comissões", icon: CircleDollarSign },
] as const

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const kwh = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 })

function value(form: FormData, field: string) {
  return String(form.get(field) ?? "").trim()
}

function numeric(form: FormData, field: string) {
  return Number(value(form, field) || 0)
}

function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    good: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-800",
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}>{children}</span>
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">{children}</div>
}

export default function OperationsHub() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("overview")
  const [data, setData] = useState<OperationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState("")
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [migrationRequired, setMigrationRequired] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/operations", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) {
        setMigrationRequired(result.code === "DATABASE_MIGRATION_REQUIRED")
        throw new Error(result.error || "Não foi possível carregar a operação.")
      }
      setData(result)
      setMigrationRequired(false)
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Falha de conexão." })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const execute = useCallback(
    async (action: string, payload: Record<string, unknown>, successMessage: string) => {
      setSaving(action)
      setNotice(null)
      try {
        const response = await fetch("/api/admin/operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Operação não concluída.")
        setNotice({ type: "success", message: successMessage })
        await load()
        return true
      } catch (error) {
        setNotice({ type: "error", message: error instanceof Error ? error.message : "Falha de conexão." })
        return false
      } finally {
        setSaving("")
      }
    },
    [load],
  )

  const availablePlantsByUnit = useMemo(() => {
    const map = new Map<string, Plant[]>()
    for (const prospect of data?.prospects ?? []) {
      for (const unit of prospect.consumerUnits) {
        map.set(
          unit.id,
          (data?.plants ?? []).filter(
            (plant) =>
              plant.supplierOrganizationId === prospect.supplierOrganizationId &&
              plant.distributionUtilityId === unit.distributionUtilityId &&
              plant.status === "OPERATIONAL",
          ),
        )
      }
    }
    return map
  }, [data])

  if (loading && !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-emerald-600" /></div>
  }

  if (migrationRequired) {
    return (
      <div className="mx-auto max-w-3xl pt-8">
        <div className="overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50">
          <div className="border-b border-amber-200 bg-amber-100/70 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-900">Ação de implantação pendente</div>
          <div className="p-7">
            <h1 className="font-display text-3xl font-semibold text-slate-900">O painel está pronto. O banco ainda não.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">A estrutura do MVP foi adicionada ao Prisma, mas não foi aplicada ao banco remoto para evitar qualquer mudança sem uma janela controlada de migração.</p>
            <code className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">npm.cmd run db:deploy</code>
            <p className="mt-3 text-xs text-slate-500">Execute somente depois de revisar a conexão e o backup. O guia está em docs/IMPLANTACAO_MVP.md.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const s = data.summary

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700"><Activity className="h-4 w-4" /> Central operacional</div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Capacidade até ativação, sem perder o fio.</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Estruture fornecedores, qualifique usinas, registre oportunidades e acompanhe a locação de quotas dentro da mesma distribuidora.</p>
        </div>
        <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"><RefreshCw className="h-4 w-4" /> Atualizar dados</button>
      </div>

      {notice && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {notice.type === "success" ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}{notice.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="flex min-w-max gap-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Capacidade disponível", metric: `${kwh.format(s.availableKwh)} kWh`, Icon: Zap, tone: "text-emerald-700 bg-emerald-100" },
              { label: "Capacidade reservada", metric: `${kwh.format(s.reservedKwh)} kWh`, Icon: Gauge, tone: "text-amber-700 bg-amber-100" },
              { label: "Oportunidades", metric: s.prospects, Icon: Users, tone: "text-blue-700 bg-blue-100" },
              { label: "Contratos ativos", metric: s.activeAgreements, Icon: Handshake, tone: "text-violet-700 bg-violet-100" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}><item.Icon className="h-5 w-5" /></div>
                <div className="font-display text-3xl font-semibold text-slate-950">{item.metric}</div>
                <div className="mt-1 text-sm text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[26px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Mapa da operação</p><h2 className="mt-2 font-display text-2xl font-semibold">Do ativo ao recebimento</h2></div><Route className="h-8 w-8 text-emerald-400" /></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-5">
                {[
                  [s.suppliers, "Fornecedores"],
                  [s.operationalPlants, "Usinas aptas"],
                  [s.partners, "Parceiros"],
                  [s.prospects, "Prospects"],
                  [s.activeAgreements, "Ativações"],
                ].map(([metric, label], index) => (
                  <div key={String(label)} className="relative rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="text-2xl font-semibold text-white">{metric}</div><div className="mt-1 text-[11px] leading-4 text-slate-400">{label}</div>
                    {index < 4 && <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-slate-950 text-emerald-400 sm:block" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-[#eff7e8] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Comissão a liberar</p>
              <div className="mt-3 font-display text-4xl font-semibold text-slate-950">{money.format(s.pendingCommission)}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">A elegibilidade é criada automaticamente quando a unidade é ativada. A aprovação e o pagamento continuam sob controle do fornecedor.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "structure" && (
        <div className="grid gap-6 xl:grid-cols-3">
          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); if (await execute("createSupplier", { name: value(f,"name"), legalName: value(f,"legalName"), documentNumber: value(f,"documentNumber"), contactName: value(f,"contactName"), contactEmail: value(f,"contactEmail"), contactPhone: value(f,"contactPhone"), responsibilityVersion: "2026-01", responsibilityAccepted: true }, "Fornecedor incluído no onboarding.")) form.reset() }} className="panel-form">
            <div className="panel-heading"><Building2 className="h-5 w-5" /><div><h2>1. Fornecedor</h2><p>Responsável pela estrutura jurídica e regulatória.</p></div></div>
            <div className="form-grid"><Field label="Nome"><input name="name" className="input-field" required /></Field><Field label="Razão social"><input name="legalName" className="input-field" /></Field><Field label="CNPJ"><input name="documentNumber" className="input-field" required /></Field><Field label="Responsável"><input name="contactName" className="input-field" required /></Field><Field label="E-mail"><input name="contactEmail" type="email" className="input-field" required /></Field><Field label="Telefone"><input name="contactPhone" className="input-field" required /></Field></div>
            <button className="admin-action" disabled={!!saving}><Plus className="h-4 w-4" /> Cadastrar fornecedor</button>
          </form>

          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); if (await execute("createUtility", { name: value(f,"name"), code: value(f,"code") }, "Distribuidora adicionada.")) form.reset() }} className="panel-form">
            <div className="panel-heading"><Zap className="h-5 w-5" /><div><h2>2. Distribuidora</h2><p>Base obrigatória para compatibilidade.</p></div></div>
            <div className="form-grid"><Field label="Nome" wide><input name="name" className="input-field" required /></Field><Field label="Código" wide><input name="code" className="input-field" placeholder="Ex.: CEMIG" required /></Field></div>
            <button className="admin-action" disabled={!!saving}><Plus className="h-4 w-4" /> Adicionar distribuidora</button>
            <div className="mt-5 flex flex-wrap gap-2">{data.utilities.map((utility) => <StatusBadge key={utility.id}>{utility.code}</StatusBadge>)}</div>
          </form>

          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); if (await execute("createEntity", { supplierOrganizationId: value(f,"supplierOrganizationId"), type: value(f,"type"), name: value(f,"name"), legalName: value(f,"legalName"), documentNumber: value(f,"documentNumber") }, "Entidade de geração compartilhada cadastrada.")) form.reset() }} className="panel-form">
            <div className="panel-heading"><Network className="h-5 w-5" /><div><h2>3. Entidade</h2><p>Associação, cooperativa ou consórcio.</p></div></div>
            <div className="form-grid"><Field label="Fornecedor" wide><select name="supplierOrganizationId" className="input-field" required><option value="">Selecione</option>{data.suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Modelo"><select name="type" className="input-field"><option value="ASSOCIATION">Associação</option><option value="COOPERATIVE">Cooperativa</option><option value="CONSORTIUM">Consórcio</option><option value="OTHER">Outro</option></select></Field><Field label="Nome"><input name="name" className="input-field" required /></Field><Field label="Razão social"><input name="legalName" className="input-field" /></Field><Field label="CNPJ"><input name="documentNumber" className="input-field" /></Field></div>
            <button className="admin-action" disabled={!!saving || !data.suppliers.length}><Plus className="h-4 w-4" /> Cadastrar entidade</button>
          </form>
        </div>
      )}

      {activeTab === "plants" && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); if (await execute("createPlant", { supplierOrganizationId: value(f,"supplierOrganizationId"), sharedGenerationEntityId: value(f,"sharedGenerationEntityId"), distributionUtilityId: value(f,"distributionUtilityId"), name: value(f,"name"), internalCode: value(f,"internalCode"), generationUnitNumber: value(f,"generationUnitNumber"), city: value(f,"city"), state: value(f,"state"), source: value(f,"source"), installedPowerKw: numeric(f,"installedPowerKw"), averageMonthlyGenerationKwh: numeric(f,"averageMonthlyGenerationKwh"), operationalKwh: numeric(f,"operationalKwh"), contractedKwh: numeric(f,"contractedKwh"), safetyMarginKwh: numeric(f,"safetyMarginKwh"), referenceMonth: value(f,"referenceMonth") }, "Usina criada e enviada para qualificação.")) form.reset() }} className="panel-form">
            <div className="panel-heading"><Factory className="h-5 w-5" /><div><h2>Nova usina</h2><p>Capacidade é registrada por competência mensal.</p></div></div>
            <div className="form-grid"><Field label="Fornecedor" wide><select name="supplierOrganizationId" className="input-field" required><option value="">Selecione</option>{data.suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Entidade" wide><select name="sharedGenerationEntityId" className="input-field" required><option value="">Selecione</option>{data.entities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Distribuidora" wide><select name="distributionUtilityId" className="input-field" required><option value="">Selecione</option>{data.utilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Nome"><input name="name" className="input-field" required /></Field><Field label="Código interno"><input name="internalCode" className="input-field" required /></Field><Field label="Nº unidade geradora"><input name="generationUnitNumber" className="input-field" /></Field><Field label="Fonte"><select name="source" className="input-field"><option value="SOLAR">Solar</option><option value="WIND">Eólica</option><option value="HYDRO">Hídrica</option><option value="BIOMASS">Biomassa</option><option value="OTHER">Outra</option></select></Field><Field label="Cidade"><input name="city" className="input-field" required /></Field><Field label="UF"><input name="state" className="input-field" maxLength={2} required /></Field><Field label="Potência instalada (kW)"><input name="installedPowerKw" type="number" min="0.001" step="0.001" className="input-field" required /></Field><Field label="Geração média (kWh)"><input name="averageMonthlyGenerationKwh" type="number" min="0.001" step="0.001" className="input-field" required /></Field><Field label="Competência"><input name="referenceMonth" type="date" className="input-field" required /></Field><Field label="Capacidade operacional"><input name="operationalKwh" type="number" min="0.001" step="0.001" className="input-field" required /></Field><Field label="Já contratada"><input name="contractedKwh" type="number" min="0" step="0.001" defaultValue="0" className="input-field" /></Field><Field label="Margem de segurança"><input name="safetyMarginKwh" type="number" min="0" step="0.001" defaultValue="0" className="input-field" /></Field></div>
            <button className="admin-action" disabled={!!saving || !data.entities.length || !data.utilities.length}><Plus className="h-4 w-4" /> Criar usina</button>
          </form>
          <div className="space-y-3">
            {data.plants.length === 0 ? <Empty>Nenhuma usina cadastrada.</Empty> : data.plants.map((plant) => { const capacity = plant.capacityPeriods[0]; return <div key={plant.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-semibold text-slate-950">{plant.name}</h3><StatusBadge tone={plant.status === "OPERATIONAL" ? "good" : "warn"}>{plant.status}</StatusBadge></div><p className="mt-1 text-sm text-slate-500">{plant.supplierOrganization.name} · {plant.distributionUtility.code} · {plant.city}/{plant.state}</p></div>{plant.status !== "OPERATIONAL" && <button onClick={() => execute("qualifyPlant", { plantId: plant.id }, "Usina qualificada para matching.")} className="admin-action-secondary"><BadgeCheck className="h-4 w-4" /> Aprovar qualificação</button>}</div>{capacity && <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Operacional",capacity.operationalKwh],["Contratada",capacity.contractedKwh],["Reservada",capacity.reservedKwh],["Disponível",capacity.availableKwh]].map(([label,metric]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><div className="text-lg font-bold text-slate-900">{kwh.format(Number(metric))}</div><div className="text-xs text-slate-500">{label} kWh</div></div>)}</div>}</div> })}
          </div>
        </div>
      )}

      {activeTab === "commercial" && (
        <div className="grid gap-6 xl:grid-cols-2">
          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); if (await execute("createPartner", { supplierOrganizationId: value(f,"supplierOrganizationId"), name: value(f,"name"), documentNumber: value(f,"documentNumber"), email: value(f,"email"), phone: value(f,"phone") }, "Parceiro comercial cadastrado.")) form.reset() }} className="panel-form"><div className="panel-heading"><Handshake className="h-5 w-5" /><div><h2>Parceiro comercial</h2><p>Dono da origem e do relacionamento com o prospect.</p></div></div><div className="form-grid"><Field label="Fornecedor" wide><select name="supplierOrganizationId" className="input-field" required><option value="">Selecione</option>{data.suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Nome"><input name="name" className="input-field" required /></Field><Field label="CPF/CNPJ"><input name="documentNumber" className="input-field" /></Field><Field label="E-mail"><input name="email" type="email" className="input-field" /></Field><Field label="Telefone"><input name="phone" className="input-field" /></Field></div><button className="admin-action" disabled={!!saving || !data.suppliers.length}><Plus className="h-4 w-4" /> Adicionar parceiro</button><div className="mt-5 space-y-2">{data.partners.map((partner) => <div key={partner.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><div><div className="text-sm font-semibold text-slate-800">{partner.name}</div><div className="text-xs text-slate-500">{partner.supplierOrganization.name}</div></div><StatusBadge>{partner._count.prospects} leads</StatusBadge></div>)}</div></form>
          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); const partnerId = value(f,"currentCommercialPartnerId"); const partner = data.partners.find((item) => item.id === partnerId); if (await execute("createProspect", { supplierOrganizationId: partner?.supplierOrganizationId, currentCommercialPartnerId: partnerId, name: value(f,"name"), documentNumber: value(f,"documentNumber"), email: value(f,"email"), phone: value(f,"phone"), source: value(f,"source"), notes: value(f,"notes"), consentVersion: "2026-01", consentAccepted: true, consumerUnit: { distributionUtilityId: value(f,"distributionUtilityId"), unitNumber: value(f,"unitNumber"), city: value(f,"city"), state: value(f,"state"), customerClass: value(f,"customerClass"), tariffGroup: value(f,"tariffGroup"), connectionType: value(f,"connectionType"), averageMonthlyConsumptionKwh: numeric(f,"averageMonthlyConsumptionKwh"), averageBillAmount: numeric(f,"averageBillAmount") || undefined } }, "Prospect e unidade consumidora cadastrados.")) form.reset() }} className="panel-form"><div className="panel-heading"><Users className="h-5 w-5" /><div><h2>Prospect + unidade</h2><p>Consentimento e origem ficam registrados.</p></div></div><div className="form-grid"><Field label="Parceiro" wide><select name="currentCommercialPartnerId" className="input-field" required><option value="">Selecione</option>{data.partners.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.supplierOrganization.name}</option>)}</select></Field><Field label="Nome"><input name="name" className="input-field" required /></Field><Field label="CPF/CNPJ"><input name="documentNumber" className="input-field" /></Field><Field label="E-mail"><input name="email" type="email" className="input-field" /></Field><Field label="Telefone"><input name="phone" className="input-field" /></Field><Field label="Origem"><input name="source" className="input-field" placeholder="Indicação, evento..." /></Field><Field label="Distribuidora"><select name="distributionUtilityId" className="input-field" required><option value="">Selecione</option>{data.utilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Nº unidade consumidora"><input name="unitNumber" className="input-field" required /></Field><Field label="Cidade"><input name="city" className="input-field" required /></Field><Field label="UF"><input name="state" className="input-field" maxLength={2} required /></Field><Field label="Classe"><input name="customerClass" className="input-field" placeholder="Residencial, comercial..." /></Field><Field label="Grupo tarifário"><input name="tariffGroup" className="input-field" /></Field><Field label="Ligação"><input name="connectionType" className="input-field" /></Field><Field label="Consumo médio (kWh)"><input name="averageMonthlyConsumptionKwh" type="number" min="0.001" className="input-field" required /></Field><Field label="Fatura média (R$)"><input name="averageBillAmount" type="number" min="0" step="0.01" className="input-field" /></Field><Field label="Observações" wide><textarea name="notes" className="input-field min-h-20" /></Field></div><label className="my-4 flex items-start gap-2 text-xs leading-5 text-slate-600"><input type="checkbox" required className="mt-1" /> Confirmo que o titular autorizou o tratamento destes dados para análise e contato.</label><button className="admin-action" disabled={!!saving || !data.partners.length}><Plus className="h-4 w-4" /> Cadastrar oportunidade</button></form>
        </div>
      )}

      {activeTab === "pipeline" && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {data.prospects.length === 0 ? <Empty>Cadastre um parceiro e um prospect para iniciar o pipeline.</Empty> : data.prospects.map((prospect) => <div key={prospect.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-xl font-semibold text-slate-950">{prospect.name}</h3><p className="mt-1 text-xs text-slate-500">{prospect.currentCommercialPartner.name} · {prospect.supplierOrganization.name}</p></div><StatusBadge tone={prospect.status === "ACTIVE" ? "good" : "neutral"}>{prospect.status}</StatusBadge></div>{prospect.consumerUnits.map((unit) => <div key={unit.id} className="mt-5 border-t border-slate-100 pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="text-sm font-semibold text-slate-800">UC {unit.unitNumber}</div><div className="text-xs text-slate-500">{unit.distributionUtility.code} · {kwh.format(Number(unit.averageMonthlyConsumptionKwh))} kWh/mês</div></div>{unit.matches.length === 0 && <div className="flex flex-wrap gap-2">{(availablePlantsByUnit.get(unit.id) ?? []).map((plant) => <button key={plant.id} onClick={() => execute("createMatch", { consumerUnitId: unit.id, plantId: plant.id }, "Matching criado.")} className="admin-action-secondary"><Zap className="h-3.5 w-3.5" /> Match {plant.name}</button>)}</div>}</div>{unit.matches.length === 0 && (availablePlantsByUnit.get(unit.id) ?? []).length === 0 && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Nenhuma usina operacional na mesma distribuidora.</p>}{unit.matches.map((match) => { const proposal = match.proposals[0]; return <div key={match.id} className="mt-4 rounded-xl bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="text-sm font-bold text-slate-900">{match.plant.name}</div><div className="text-xs text-slate-500">Quota sugerida: {kwh.format(Number(match.suggestedKwh))} kWh · score {Number(match.score)}</div></div><StatusBadge tone={match.reservation ? "good" : "warn"}>{match.reservation ? "RESERVADO" : match.status}</StatusBadge></div>{!match.reservation && <button onClick={() => execute("reserveMatch", { matchId: match.id }, "Capacidade reservada por sete dias.")} className="admin-action mt-3">Reservar capacidade</button>}{match.reservation && !proposal && <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); await execute("createProposal", { matchId: match.id, monthlyLeaseAmount: numeric(f,"monthlyLeaseAmount"), estimatedMonthlySavings: numeric(f,"estimatedMonthlySavings") || undefined, estimatedSavingsPercent: numeric(f,"estimatedSavingsPercent") || undefined, validDays: 15 }, "Proposta registrada e enviada.") }} className="mt-3 grid gap-2 sm:grid-cols-3"><input name="monthlyLeaseAmount" type="number" min="0.01" step="0.01" className="input-field" placeholder="Locação mensal R$" required /><input name="estimatedMonthlySavings" type="number" min="0" step="0.01" className="input-field" placeholder="Economia R$" /><button className="admin-action">Criar proposta</button></form>}{proposal && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"><div className="text-xs text-slate-600">Proposta v{proposal.version} · {money.format(Number(proposal.monthlyLeaseAmount))} · {proposal.status}</div>{proposal.status === "SENT" && <button onClick={() => execute("acceptProposal", { proposalId: proposal.id }, "Proposta aceita; adesão e contrato iniciados.")} className="admin-action-secondary"><Check className="h-4 w-4" /> Aceitar e iniciar adesão</button>}</div>}</div>})}</div>)}</div>) }
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-6">
            <div className="panel-heading"><Activity className="h-5 w-5" /><div><h2>Ativações</h2><p>Marcos documentais e retorno da distribuidora.</p></div></div>
            <div className="mt-5 space-y-3">{data.agreements.length === 0 ? <Empty>Nenhum contrato iniciado.</Empty> : data.agreements.map((agreement) => <div key={agreement.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{agreement.proposal.match.consumerUnit.prospect.name}</h3><StatusBadge tone={agreement.status === "ACTIVE" ? "good" : "warn"}>{agreement.status}</StatusBadge></div><p className="mt-1 text-xs text-slate-500">{agreement.plant.name} · UC {agreement.consumerUnit.unitNumber} · {kwh.format(Number(agreement.quotaKwh))} kWh</p><p className="mt-2 text-xs font-semibold text-slate-700">Ativação: {agreement.activationProcess?.status ?? "NÃO INICIADA"}</p></div>{agreement.activationProcess && agreement.activationProcess.status !== "ACTIVATED" && <div className="flex flex-wrap items-center gap-2"><select id={`activation-${agreement.id}`} className="input-field min-w-52" defaultValue={agreement.activationProcess.status}><option value="DOCUMENTS_PENDING">Documentos pendentes</option><option value="READY_TO_SUBMIT">Pronto para protocolo</option><option value="SUBMITTED">Protocolado</option><option value="UNDER_UTILITY_REVIEW">Em análise na distribuidora</option><option value="CORRECTION_REQUESTED">Correção solicitada</option><option value="APPROVED">Aprovado</option><option value="ACTIVATED">Ativado</option></select><button onClick={() => { const select = document.getElementById(`activation-${agreement.id}`) as HTMLSelectElement; execute("updateActivation", { activationProcessId: agreement.activationProcess?.id, status: select.value }, "Etapa de ativação atualizada.") }} className="admin-action">Atualizar</button></div>}</div>)}</div>
          </div>
        </div>
      )}

      {activeTab === "commission" && (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const f = new FormData(form); const type = value(f,"type"); if (await execute("createCommissionPolicy", { supplierOrganizationId: value(f,"supplierOrganizationId"), name: value(f,"name"), type, fixedAmount: type === "PERCENTAGE_OF_LEASE" ? undefined : numeric(f,"fixedAmount"), percentage: type === "PERCENTAGE_OF_LEASE" ? numeric(f,"percentage") : undefined, recurringMonths: type === "RECURRING_PER_ACTIVE_UNIT" ? numeric(f,"recurringMonths") : undefined }, "Política de comissão ativada.")) form.reset() }} className="panel-form"><div className="panel-heading"><Banknote className="h-5 w-5" /><div><h2>Política de comissão</h2><p>Uma política ativa por fornecedor.</p></div></div><div className="form-grid"><Field label="Fornecedor" wide><select name="supplierOrganizationId" className="input-field" required><option value="">Selecione</option>{data.suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Nome" wide><input name="name" className="input-field" placeholder="Comissão piloto" required /></Field><Field label="Modelo" wide><select name="type" className="input-field"><option value="FIXED_ON_ACTIVATION">Fixa na ativação</option><option value="PERCENTAGE_OF_LEASE">Percentual da locação</option><option value="RECURRING_PER_ACTIVE_UNIT">Recorrente por unidade ativa</option></select></Field><Field label="Valor fixo (R$)"><input name="fixedAmount" type="number" min="0" step="0.01" className="input-field" /></Field><Field label="Percentual"><input name="percentage" type="number" min="0" max="100" step="0.01" className="input-field" /></Field><Field label="Meses recorrentes" wide><input name="recurringMonths" type="number" min="1" max="60" className="input-field" /></Field></div><button className="admin-action" disabled={!!saving || !data.suppliers.length}><Plus className="h-4 w-4" /> Ativar política</button><div className="mt-5 space-y-2">{data.commissionPolicies.map((policy) => <div key={policy.id} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between"><div className="text-sm font-semibold text-slate-800">{policy.name}</div><StatusBadge tone={policy.active ? "good" : "neutral"}>{policy.active ? "ATIVA" : "HISTÓRICA"}</StatusBadge></div><div className="mt-1 text-xs text-slate-500">{policy.supplierOrganization.name} · {policy.type}</div></div>)}</div></form>
          <div className="rounded-[26px] border border-slate-200 bg-white p-6"><div className="panel-heading"><CircleDollarSign className="h-5 w-5" /><div><h2>Lançamentos</h2><p>Rastreáveis por parceiro, prospect e contrato.</p></div></div><div className="mt-5 space-y-2">{data.commissionEntries.length === 0 ? <Empty>As comissões aparecem quando uma proposta é aceita.</Empty> : data.commissionEntries.map((entry) => <div key={entry.id} className="grid gap-2 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="text-sm font-semibold text-slate-900">{entry.commercialPartner.name}</div><div className="text-xs text-slate-500">Prospect: {entry.prospect.name} · competência {new Date(entry.competence).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}</div></div><div className="text-right"><div className="font-display text-xl font-semibold text-slate-950">{money.format(Number(entry.amount))}</div><StatusBadge tone={entry.status === "ELIGIBLE" || entry.status === "PAID" ? "good" : "warn"}>{entry.status}</StatusBadge></div></div>)}</div></div>
        </div>
      )}
    </div>
  )
}
