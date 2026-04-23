"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/simulacao", label: "Simule sua Economia" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-navy shadow-lg shadow-navy/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-energy-500 shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base tracking-tight whitespace-nowrap">
              <span className="text-white">Mercadolivre</span>
              <span className="text-energy-400">GD</span>
              <span className="text-white">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? "text-energy-400 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/fornecedor"
              className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-all"
            >
              Sou Fornecedor
            </Link>
            <Link
              href="/economizar"
              className="px-4 py-2 text-sm font-semibold text-navy bg-energy-500 rounded-lg hover:bg-energy-400 transition-colors shadow-glow"
            >
              Quero Economizar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-white/10 mt-2">
              <Link
                href="/fornecedor"
                className="block px-4 py-3 text-center text-sm font-semibold text-slate-200 border border-white/20 rounded-lg"
              >
                Sou Fornecedor
              </Link>
              <Link
                href="/economizar"
                className="block px-4 py-3 text-center text-sm font-semibold text-navy bg-energy-500 rounded-lg"
              >
                Quero Economizar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
