import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { checkRateLimit, getRequestClientKey } from "@/lib/rate-limit"

const schema = z.object({
  nome: z.string().trim().min(3).max(200),
  cpf: z.string().trim().min(11).max(18),
  email: z.string().trim().email().max(200),
  telefone: z.string().trim().min(10).max(32),
  endereco: z.string().trim().min(5).max(300),
  cidade: z.string().trim().min(2).max(120),
  estado: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  cep: z.string().trim().min(8).max(10),
  distribuidora: z.string().trim().min(2).max(160),
  valorMedio: z.coerce.number().finite().positive().max(100_000_000),
  consumoMedio: z.coerce.number().finite().positive().max(1_000_000_000).optional(),
  aceiteLgpd: z.literal("true"),
  aceitePrivacidade: z.literal("true"),
})

export async function POST(request: Request) {
  const limit = checkRateLimit(`consumer-lead:${getRequestClientKey(request)}`, 8, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json({ error: "Limite de cadastros atingido. Tente mais tarde." }, { status: 429 })
  }

  try {
    const formData = await request.formData()
    const payload = schema.parse(Object.fromEntries(formData.entries()))
    const cliente = await prisma.cliente.create({
      data: {
        nome: payload.nome,
        cpf: payload.cpf,
        email: payload.email,
        telefone: payload.telefone,
        endereco: payload.endereco,
        cidade: payload.cidade,
        estado: payload.estado,
        cep: payload.cep,
        distribuidora: payload.distribuidora,
        valorMedio: payload.valorMedio,
        consumoMedio: payload.consumoMedio ?? null,
        contaEnergiaUrl: null,
        documentoUrl: null,
        aceiteLgpd: true,
        aceitePrivacidade: true,
        status: "NOVO_CADASTRO",
      },
    })
    return NextResponse.json({ success: true, id: cliente.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Revise os campos obrigatórios e os consentimentos." }, { status: 400 })
    }
    if (error instanceof Error && (error.message.includes("arquivo") || error.message.includes("MB"))) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error("[POST /api/clientes]", error)
    return NextResponse.json({ error: "Erro interno ao processar cadastro" }, { status: 500 })
  }
}
