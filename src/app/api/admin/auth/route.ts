import { timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createAdminSession, SESSION_COOKIE } from "@/lib/auth"
import { checkRateLimit, getRequestClientKey } from "@/lib/rate-limit"

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export async function POST(request: Request) {
  try {
    const clientKey = getRequestClientKey(request)
    const rateLimit = checkRateLimit(`admin-login:${clientKey}`, 8, 15 * 60 * 1000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }

    const body = (await request.json()) as { password?: unknown }
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || !process.env.AUTH_SECRET) {
      return NextResponse.json({ error: "Autenticação não configurada" }, { status: 503 })
    }
    if (typeof body.password !== "string" || !safeCompare(body.password, adminPassword)) {
      return NextResponse.json({ error: "Credencial inválida" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, await createAdminSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[POST /api/admin/auth]", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ success: true })
}
