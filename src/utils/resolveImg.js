export function resolveImg(path) {
  if (!path) return ''
  const p = String(path).trim()
  if (/^(https?:|data:|blob:)/i.test(p) || p.startsWith('//')) return p

  const isProd = import.meta.env.PROD
  if (isProd) {
    const rel = p.startsWith('/') ? p.slice(1) : p
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return new URL(`/api/img/${rel}`, origin).href   // => https://freshlog.ttshow.tw/api/img/...
  }

  const base = import.meta.env.VITE_ASSET_BASE || 'http://43.199.27.51'
  return new URL(p.startsWith('/') ? p : `/${p}`, base).href
}
