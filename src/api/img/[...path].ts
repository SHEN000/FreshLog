// api/img/[...path].ts
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const url = new URL(req.url)
  // 取出 /api/img/ 之後的路徑
  const rest = url.pathname.replace(/^\/api\/img\/?/, '') // e.g. "images/F001.jpg"
  const upstreamPath = rest || ''                         // 允許直接傳 images/F001.jpg
  const upstream = `http://43.199.27.51/${upstreamPath}`  // 後端仍是 http

  const r = await fetch(upstream)
  if (!r.ok) return new Response('Not Found', { status: r.status })

  // 複製 header，移除 content-encoding，補上快取與 content-type（必要時）
  const headers = new Headers(r.headers)
  headers.delete('content-encoding')
  headers.set('cache-control', 'public, max-age=86400')
  if (!headers.get('content-type')) headers.set('content-type', 'image/jpeg')
  return new Response(r.body, { status: r.status, headers })
}
