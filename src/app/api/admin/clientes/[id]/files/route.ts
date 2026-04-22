import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { saveUploadedFile } from "@/lib/server-utils";
import fs from "fs/promises";
import path from "path";

function checkAuth(): boolean {
  const session = cookies().get("admin_session")?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !session) return false;
  return session === Buffer.from(adminPass).toString("base64");
}

async function deleteFileIfExists(fileUrl: string | null) {
  if (!fileUrl) return;
  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    await fs.unlink(filePath);
  } catch {
    // File might not exist, ignore
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await request.formData();
  const tipo = formData.get("tipo") as "conta" | "documento";
  const file = formData.get("file") as File | null;

  if (!file || !tipo) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const cliente = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  // Delete old file
  if (tipo === "conta") await deleteFileIfExists(cliente.contaEnergiaUrl);
  if (tipo === "documento") await deleteFileIfExists(cliente.documentoUrl);

  const url = await saveUploadedFile(file, tipo === "conta" ? "conta" : "doc");

  const updated = await prisma.cliente.update({
    where: { id: params.id },
    data: tipo === "conta" ? { contaEnergiaUrl: url } : { documentoUrl: url },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { tipo } = await request.json() as { tipo: "conta" | "documento" };

  const cliente = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  if (tipo === "conta") await deleteFileIfExists(cliente.contaEnergiaUrl);
  if (tipo === "documento") await deleteFileIfExists(cliente.documentoUrl);

  const updated = await prisma.cliente.update({
    where: { id: params.id },
    data: tipo === "conta" ? { contaEnergiaUrl: null } : { documentoUrl: null },
  });

  return NextResponse.json(updated);
}
