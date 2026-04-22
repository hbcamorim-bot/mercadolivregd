import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

function checkAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !session) return false;
  return session === Buffer.from(adminPass).toString("base64");
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const fornecedores = await prisma.fornecedor.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(fornecedores);
}

export async function PATCH(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, status } = await request.json();
  const fornecedor = await prisma.fornecedor.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(fornecedor);
}
