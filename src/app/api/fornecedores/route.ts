import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { checkRateLimit, getRequestClientKey } from "@/lib/rate-limit"

const schema = z.object({
  nome: z.string().trim().min(3).max(200),
  email: z.string().trim().email().max(200),
  telefone: z.string().trim().min(10).max(32),
  kwhDisponivel: z.coerce.number().finite().positive().max(1_000_000_000),
  regiaoAtuacao: z.string().trim().min(2).max(160),
  distribuidoras: z.string().trim().min(2).max(500),
  observacoes: z.string().trim().max(2000).optional(),
})

export async function POST(request: Request) {
  const limit = checkRateLimit(`supplier-lead:${getRequestClientKey(request)}`, 8, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json({ error: "Limite de cadastros atingido. Tente mais tarde." }, { status: 429 })
  }

  try {
    const payload = schema.parse(await request.json())
    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome: payload.nome,
        email: payload.email,
        telefone: payload.telefone,
        kwhDisponivel: payload.kwhDisponivel,
        regiaoAtuacao: payload.regiaoAtuacao,
        distribuidoras: payload.distribuidoras,
        observacoes: payload.observacoes || null,
        status: "NOVO_ONBOARDING",
      },
    })
    return NextResponse.json({ success: true, id: fornecedor.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Revise os dados informados." }, { status: 400 })
    }
    console.error("[POST /api/fornecedores]", error)
    return NextResponse.json({ error: "Erro interno ao processar cadastro" }, { status: 500 })
  }
}
