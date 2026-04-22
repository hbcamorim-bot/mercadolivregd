import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass || password !== adminPass) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    const cookieStore = cookies();
    cookieStore.set("admin_session", Buffer.from(adminPass).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
