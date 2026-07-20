import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const estado = searchParams.get("estado") || undefined;

  const clientes = await prisma.cliente.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(estado ? { estado } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clientes);
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, status, observacoes } = await request.json();
  const cliente = await prisma.cliente.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(observacoes !== undefined ? { observacoes } : {}),
    },
  });

  return NextResponse.json(cliente);
}
