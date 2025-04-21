// 儲存角色至 localStorage
export function saveRole(role) {
  localStorage.setItem('userRole', role)
}

// 從 localStorage 取得角色，預設為 consumer  
export function getRole() {
  return localStorage.getItem('userRole') || 'consumer'
}
