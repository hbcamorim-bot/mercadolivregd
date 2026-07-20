import Link from "next/link"
import { Mail, MapPin, Phone, Route } from "lucide-react"

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999"
const email = process.env.NEXT_PUBLIC_EMAIL ?? "contato@mercadolivregd.com"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#071d19] text-[#bdd0c9]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div><Link href="/" className="flex items-center gap-3 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b2ff49] text-[#071d19]"><Route className="h-5 w-5" /></span><span className="font-display font-semibold">Mercado Livre GD</span></Link><p className="mt-5 max-w-md text-sm leading-6 text-[#90aaa1]">Infraestrutura comercial para fornecedores de geração compartilhada controlarem capacidade, rede comercial, locação de quotas e ativações.</p></div>
          <div><h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Produto</h3><div className="mt-4 space-y-3 text-sm"><Link className="block hover:text-[#b2ff49]" href="/como-funciona">Fluxo operacional</Link><Link className="block hover:text-[#b2ff49]" href="/fornecedor">Onboarding de fornecedor</Link><Link className="block hover:text-[#b2ff49]" href="/economizar">Cadastrar oportunidade</Link><Link className="block hover:text-[#b2ff49]" href="/politica-privacidade">Privacidade e LGPD</Link></div></div>
          <div><h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Contato</h3><div className="mt-4 space-y-3 text-sm"><a className="flex items-center gap-2 hover:text-[#b2ff49]" href={`mailto:${email}`}><Mail className="h-4 w-4" />{email}</a><a className="flex items-center gap-2 hover:text-[#b2ff49]" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><Phone className="h-4 w-4" />WhatsApp comercial</a><span className="flex items-center gap-2"><MapPin className="h-4 w-4" />Atendimento nacional</span></div></div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] leading-5 text-[#718c82] md:flex-row md:items-center md:justify-between"><span>© {new Date().getFullYear()} Mercado Livre GD.</span><span className="max-w-3xl">A plataforma não compra ou vende créditos de energia. A responsabilidade jurídica, regulatória, contratual e operacional permanece com cada fornecedor.</span></div>
      </div>
    </footer>
  )
}
