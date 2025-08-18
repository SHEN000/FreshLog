export function resolveImg(path) {
  if (!path) return ''
  const trimmed = String(path).trim()

  // 已是完整網址就直接回傳
  if (/^(http|https|data|blob):/i.test(trimmed) || trimmed.startsWith('//')) {
    return trimmed
  }

  // 預設用 .env 裡的 VITE_ASSET_BASE
  const base = import.meta.env.VITE_ASSET_BASE
  if (!base) return trimmed

  return new URL(trimmed.startsWith('/') ? trimmed : `/${trimmed}`, base).href
}