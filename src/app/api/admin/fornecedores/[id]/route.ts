import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const fornecedor = await prisma.fornecedor.findUnique({ where: { id } });
  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  return NextResponse.json(fornecedor);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { nome, email, telefone, kwhDisponivel, regiaoAtuacao, distribuidoras, observacoes, status } = body;

  const fornecedor = await prisma.fornecedor.update({
    where: { id },
    data: {
      nome,
      email,
      telefone,
      kwhDisponivel: kwhDisponivel !== undefined ? parseFloat(String(kwhDisponivel)) : undefined,
      regiaoAtuacao,
      distribuidoras,
      observacoes: observacoes ?? null,
      status,
    },
  });

  return NextResponse.json(fornecedor);
}
