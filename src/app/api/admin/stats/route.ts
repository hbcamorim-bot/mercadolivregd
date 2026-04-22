import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

function checkAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !session) return false;
  return session === Buffer.from(adminPass).toString("base64");
}

export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const [clientes, fornecedores] = await Promise.all([
      prisma.cliente.findMany({ select: { status: true, valorMedio: true, createdAt: true } }),
      prisma.fornecedor.findMany({ select: { kwhDisponivel: true, createdAt: true } }),
    ]);

    const totalClientes = clientes.length;
    const totalFornecedores = fornecedores.length;
    const kwhTotal = fornecedores.reduce((s, f) => s + f.kwhDisponivel, 0);
    const negociacoesAtivas = clientes.filter(
      (c) => !["NOVO_CADASTRO", "CONVERTIDO", "NAO_CONVERTIDO"].includes(c.status)
    ).length;
    const convertidos = clientes.filter((c) => c.status === "CONVERTIDO").length;
    const taxaConversao = totalClientes > 0 ? (convertidos / totalClientes) * 100 : 0;
    const economiaPotencial = clientes.reduce((s, c) => s + c.valorMedio * 0.25 * 12, 0);

    const statusCount: Record<string, number> = {};
    clientes.forEach((c) => {
      statusCount[c.status] = (statusCount[c.status] || 0) + 1;
    });
    const clientesPorStatus = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

    const agora = new Date();
    const cadastrosPorMes = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(agora.getFullYear(), agora.getMonth() - (5 - i), 1);
      const proximo = new Date(agora.getFullYear(), agora.getMonth() - (5 - i) + 1, 1);
      const mes = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      const cli = clientes.filter((c) => new Date(c.createdAt) >= d && new Date(c.createdAt) < proximo).length;
      const forn = fornecedores.filter((f) => new Date(f.createdAt) >= d && new Date(f.createdAt) < proximo).length;
      return { mes, clientes: cli, fornecedores: forn };
    });

    return NextResponse.json({
      totalClientes, totalFornecedores, kwhTotal, negociacoesAtivas,
      convertidos, taxaConversao, economiaPotencial, clientesPorStatus, cadastrosPorMes,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
