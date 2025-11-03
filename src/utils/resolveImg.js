export function resolveImg(path, type = 'auto') {
  if (!path) return ''
  const trimmed = String(path).trim()

  // 已是完整網址就直接回傳
  if (/^(http|https|data|blob):/i.test(trimmed) || trimmed.startsWith('//')) {
    return trimmed
  }

  // 預設用 .env 裡的 VITE_ASSET_BASE
  const base = import.meta.env.VITE_ASSET_BASE
  if (!base) {
    console.warn('⚠️ VITE_ASSET_BASE 未設定,使用相對路徑:', trimmed)
    return trimmed
  }

  // 🔧 改善 URL 組裝邏輯
  try {
    let normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

    // 🆕 智能路徑修正:檢查是否缺少子目錄
    // 如果路徑是 /images/XXX.jpg 格式(沒有子目錄),嘗試添加子目錄
    const pathPattern = /^\/images\/([^\/]+\.(jpg|jpeg|png|gif|webp))$/i
    const match = normalizedPath.match(pathPattern)

    if (match) {
      const filename = match[1]
      console.log('🔍 檢測到簡化路徑:', normalizedPath, '檔名:', filename)

      // 根據檔名判斷類型
      let subDir = ''
      if (type === 'recipe' || filename.includes('recipe') || filename.includes('_R')) {
        subDir = 'recipes'
      } else if (type === 'food' || /^F\d+/.test(filename)) {
        // F 開頭的檔名可能是食材
        subDir = 'foods'
      }

      if (subDir) {
        const newPath = `/images/${subDir}/${filename}`
        console.log(`🔧 路徑修正: ${normalizedPath} → ${newPath}`)
        normalizedPath = newPath
      } else {
        console.warn('⚠️ 無法判斷圖片類型,使用原始路徑:', normalizedPath)
      }
    }

    // 移除 base URL 末尾的斜線 (如果有)
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base

    // 組裝完整 URL
    const fullUrl = `${normalizedBase}${normalizedPath}`

    // 驗證是否為有效 URL
    new URL(fullUrl) // 會拋出錯誤如果無效

    return fullUrl
  } catch (error) {
    console.error('❌ 圖片 URL 組裝失敗:', { path: trimmed, base, error: error.message })
    // 回退方案:嘗試直接組合
    return `${base}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
  }
}
