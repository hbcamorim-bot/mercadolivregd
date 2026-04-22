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

  const fornecedor = await prisma.fornecedor.findUnique({ where: { id: params.id } });
  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  return NextResponse.json(fornecedor);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { nome, email, telefone, kwhDisponivel, regiaoAtuacao, distribuidoras, observacoes, status } = body;

  const fornecedor = await prisma.fornecedor.update({
    where: { id: params.id },
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
