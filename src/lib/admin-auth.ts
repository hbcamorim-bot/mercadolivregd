import { cookies } from "next/headers"
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/auth"

export async function isAdminAuthenticated() {
  return verifyAdminSession((await cookies()).get(SESSION_COOKIE)?.value)
}
