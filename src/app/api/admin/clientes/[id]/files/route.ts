import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { deleteStoredFile, saveUploadedFile } from "@/lib/server-utils"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const formData = await request.formData()
    const tipo = formData.get("tipo") as "conta" | "documento"
    const file = formData.get("file") as File | null
    if (!file || !["conta", "documento"].includes(tipo)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const cliente = await prisma.cliente.findUnique({ where: { id } })
    if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })

    const oldUrl = tipo === "conta" ? cliente.contaEnergiaUrl : cliente.documentoUrl
    const url = await saveUploadedFile(file, tipo === "conta" ? "conta" : "doc")
    const updated = await prisma.cliente.update({
      where: { id },
      data: tipo === "conta" ? { contaEnergiaUrl: url } : { documentoUrl: url },
    })
    await deleteStoredFile(oldUrl)

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível salvar o arquivo." },
      { status: 400 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const { tipo } = (await request.json()) as { tipo: "conta" | "documento" }
  if (!["conta", "documento"].includes(tipo)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  }

  const cliente = await prisma.cliente.findUnique({ where: { id } })
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })

  const oldUrl = tipo === "conta" ? cliente.contaEnergiaUrl : cliente.documentoUrl
  const updated = await prisma.cliente.update({
    where: { id },
    data: tipo === "conta" ? { contaEnergiaUrl: null } : { documentoUrl: null },
  })
  await deleteStoredFile(oldUrl)

  return NextResponse.json(updated)
}
