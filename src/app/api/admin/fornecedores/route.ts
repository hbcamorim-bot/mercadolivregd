import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const fornecedores = await prisma.fornecedor.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(fornecedores);
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, status } = await request.json();
  const fornecedor = await prisma.fornecedor.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(fornecedor);
}
