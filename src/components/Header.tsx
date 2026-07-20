"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Route, X } from "lucide-react"

const links = [
  { href: "/como-funciona", label: "Fluxo operacional" },
  { href: "/sobre", label: "Modelo" },
  { href: "/contato", label: "Contato" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled || pathname !== "/" ? "border-b border-white/10 bg-[#071d19]/95 shadow-lg backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b2ff49] text-[#071d19]"><Route className="h-5 w-5" /></span>
          <span className="leading-none"><span className="block font-display text-base font-semibold tracking-tight">mercadolivre</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b2ff49]">GD · operação</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${pathname === link.href ? "bg-white/10 text-white" : "text-[#bdd0c9] hover:text-white"}`}>{link.label}</Link>)}</nav>
        <div className="hidden items-center gap-3 lg:flex"><Link href="/admin/login" className="px-3 py-2 text-sm font-semibold text-[#bdd0c9] hover:text-white">Entrar</Link><Link href="/fornecedor" className="rounded-full bg-[#b2ff49] px-4 py-2.5 text-sm font-bold text-[#071d19] transition hover:bg-white">Iniciar onboarding</Link></div>
        <button onClick={() => setOpen(!open)} className="rounded-xl p-2 text-white lg:hidden" aria-label="Abrir menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#071d19] px-5 py-5 lg:hidden"><div className="space-y-1">{links.map((link) => <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#bdd0c9] hover:bg-white/10">{link.label}</Link>)}<Link href="/admin/login" className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#bdd0c9]">Entrar</Link><Link href="/fornecedor" className="mt-3 block rounded-xl bg-[#b2ff49] px-4 py-3 text-center text-sm font-bold text-[#071d19]">Iniciar onboarding</Link></div></div>}
    </header>
  )
}
