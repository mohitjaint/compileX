let accessToken: string | null = null

let rotateTokenFn: (() => Promise<string | null>) | null = null
let clearAuthFn: (() => void) | null = null

export function setAccessToken(token: string | null) {
  accessToken = token ?? null
}

export function getAccessToken() {
  return accessToken
}

export function setRotateToken(fn: (() => Promise<string | null>) | null) {
  rotateTokenFn = fn
}

export async function rotateToken(): Promise<string | null> {
  if (!rotateTokenFn) return null
  try {
    const t = await rotateTokenFn()
    accessToken = t ?? null
    return t ?? null
  } catch (err) {
    return null
  }
}

export function setClearAuth(fn: (() => void) | null) {
  clearAuthFn = fn
}

export function clearAuth() {
  try {
    clearAuthFn?.()
  } finally {
    accessToken = null
  }
}

export default {
  setAccessToken,
  getAccessToken,
  setRotateToken,
  rotateToken,
  setClearAuth,
  clearAuth,
}
