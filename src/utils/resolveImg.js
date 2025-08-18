// src/utils/resolveImg.js
export function resolveImg(path) {
  if (!path) return ''
  const p = String(path).trim()

  // 完整/特殊 URL 直接回傳
  if (/^(https?:|data:|blob:)/i.test(p) || p.startsWith('//')) return p

  const isProd = import.meta.env.PROD
  if (isProd) {
    // 產線用 HTTPS 代理，避免 Mixed Content
    const rel = p.startsWith('/') ? p.slice(1) : p  // 去掉前導斜線
    return `/api/img/${rel}`                        // e.g. /api/img/images/F001.jpg
  }

  // 本機開發直接打後端 IP（保留你的 .env）
  const base = import.meta.env.VITE_ASSET_BASE || 'http://43.199.27.51'
  return new URL(p.startsWith('/') ? p : `/${p}`, base).href
}
