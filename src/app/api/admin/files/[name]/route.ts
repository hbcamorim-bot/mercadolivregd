import fs from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { resolvePrivateUpload } from "@/lib/server-utils"

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".png": "image/png",
}

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { name } = await params
    const filePath = resolvePrivateUpload(name)
    const file = await fs.readFile(filePath)
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${name}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 })
  }
}
