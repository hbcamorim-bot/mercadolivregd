import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  return NextResponse.json(cliente);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const {
    nome, cpf, email, telefone, endereco, cidade, estado, cep,
    distribuidora, valorMedio, consumoMedio, status, observacoes,
  } = body;

  const cliente = await prisma.cliente.update({
    where: { id },
    data: {
      nome, cpf, email, telefone, endereco, cidade, estado, cep,
      distribuidora,
      valorMedio: valorMedio !== undefined ? parseFloat(String(valorMedio)) : undefined,
      consumoMedio: consumoMedio !== undefined ? (consumoMedio === "" ? null : parseFloat(String(consumoMedio))) : undefined,
      status,
      observacoes,
    },
  });

  return NextResponse.json(cliente);
}
