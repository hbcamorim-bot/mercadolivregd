export const SESSION_COOKIE = "mlgd_session"

type AdminSession = {
  role: "PLATFORM_ADMIN"
  issuedAt: number
  expiresAt: number
}

const encoder = new TextEncoder()

function base64UrlEncode(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? encoder.encode(value) : value
  let binary = ""

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index])
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

export async function createAdminSession(ttlSeconds = 60 * 60 * 8) {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET precisa ter pelo menos 32 caracteres.")
  }

  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = {
    role: "PLATFORM_ADMIN",
    issuedAt: now,
    expiresAt: now + ttlSeconds,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getHmacKey(secret),
    encoder.encode(encodedPayload),
  )

  return `${encodedPayload}.${base64UrlEncode(new Uint8Array(signature))}`
}

export async function verifyAdminSession(token?: string | null) {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32 || !token) return false

  const [encodedPayload, encodedSignature, ...extra] = token.split(".")
  if (!encodedPayload || !encodedSignature || extra.length > 0) return false

  try {
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await getHmacKey(secret),
      base64UrlDecode(encodedSignature),
      encoder.encode(encodedPayload),
    )
    if (!validSignature) return false

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(encodedPayload)),
    ) as AdminSession

    return (
      payload.role === "PLATFORM_ADMIN" &&
      Number.isInteger(payload.expiresAt) &&
      payload.expiresAt > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}
