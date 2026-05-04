interface CookieOptions {
  maxAgeSeconds?: number
  path?: string
  sameSite?: 'Lax' | 'Strict' | 'None'
  secure?: boolean
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie.split('; ').find((row) => row.startsWith(prefix))
  return match ? decodeURIComponent(match.slice(prefix.length)) : null
}

export function setCookie(
  name: string,
  value: string,
  {
    maxAgeSeconds = 60 * 60 * 24 * 7,
    path = '/',
    sameSite = 'Lax',
    secure = window.location.protocol === 'https:',
  }: CookieOptions = {},
): void {
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAgeSeconds}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ]
  if (secure) parts.push('Secure')
  document.cookie = parts.join('; ')
}

export function removeCookie(name: string, path = '/'): void {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}`
}
