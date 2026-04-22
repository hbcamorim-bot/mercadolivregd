import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, kwhDisponivel, regiaoAtuacao, distribuidoras, observacoes } = body;

    if (!nome || !email || !telefone || !kwhDisponivel || !regiaoAtuacao || !distribuidoras) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        email,
        telefone,
        kwhDisponivel: parseFloat(String(kwhDisponivel)),
        regiaoAtuacao,
        distribuidoras,
        observacoes: observacoes || null,
        status: "ATIVO",
      },
    });

    return NextResponse.json({ success: true, id: fornecedor.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/fornecedores]", err);
    return NextResponse.json({ error: "Erro interno ao processar cadastro" }, { status: 500 });
  }
}
