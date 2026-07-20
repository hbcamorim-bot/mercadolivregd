type RateLimitEntry = {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as {
  mlgdRateLimit?: Map<string, RateLimitEntry>
}

const store = globalForRateLimit.mlgdRateLimit ?? new Map<string, RateLimitEntry>()
globalForRateLimit.mlgdRateLimit = store

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  current.count += 1
  store.set(key, current)

  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
  }
}

export function getRequestClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}
