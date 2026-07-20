"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Users,
  Building2,
  Route,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin/operacao", icon: Route, label: "Operação GD" },
  { href: "/admin/clientes", icon: Users, label: "Cadastros legados" },
  { href: "/admin/fornecedores", icon: Building2, label: "Leads fornecedores" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-energy-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-white font-bold text-sm block leading-none">mercadolivre</span>
          <span className="text-energy-400 font-bold text-sm block leading-none">GD • Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`admin-sidebar-link ${
              pathname === item.href ? "active" : ""
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="admin-sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f1] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 flex flex-col md:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-slate-700 text-sm">
            {NAV.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </span>
          <div className="ml-auto">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Ver site →
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
