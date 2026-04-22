import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

function checkAuth(): boolean {
  const session = cookies().get("admin_session")?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !session) return false;
  return session === Buffer.from(adminPass).toString("base64");
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const cliente = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  return NextResponse.json(cliente);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const {
    nome, cpf, email, telefone, endereco, cidade, estado, cep,
    distribuidora, valorMedio, consumoMedio, status, observacoes,
  } = body;

  const cliente = await prisma.cliente.update({
    where: { id: params.id },
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
