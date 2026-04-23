import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyNovoFornecedor } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nome, email, telefone, kwhDisponivel, regiaoAtuacao, distribuidoras,
      cidade, estado, faixaDesconto, perfilCliente, tipoOferta,
      prazoDisponibilidade, observacoes,
    } = body;

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
        cidade: cidade || null,
        estado: estado || null,
        faixaDesconto: faixaDesconto || null,
        perfilCliente: perfilCliente || null,
        tipoOferta: tipoOferta || null,
        prazoDisponibilidade: prazoDisponibilidade || null,
        observacoes: observacoes || null,
        status: "ATIVO",
      },
    });

    await notifyNovoFornecedor({ nome, email, telefone, kwhDisponivel: parseFloat(String(kwhDisponivel)), regiaoAtuacao, distribuidoras, faixaDesconto, tipoOferta });

    return NextResponse.json({ success: true, id: fornecedor.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/fornecedores]", err);
    return NextResponse.json({ error: "Erro interno ao processar cadastro" }, { status: 500 });
  }
}
