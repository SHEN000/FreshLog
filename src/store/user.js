import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 只存「原始 JWT」，不要加 'Bearer '
    token: localStorage.getItem('userToken') || '',
    isAuthenticated: !!localStorage.getItem('userToken'),

    userRole: localStorage.getItem('userRole') || 'consumer',
    userId: Number(localStorage.getItem('userId')) || null,
    userName: localStorage.getItem('userName') || '',
    userInfo: {},
  }),

  getters: {
    // 需要時才組 Authorization header
    authHeader: (s) => (s.token ? `Bearer ${s.token.replace(/^Bearer\s+/, '')}` : ''),
  },

  actions: {
    // 唯一能改 token 的地方
    setToken(token) {
      this.token = token || ''
      this.isAuthenticated = !!this.token
      if (this.token) {
        localStorage.setItem('userToken', this.token)
      } else {
        localStorage.removeItem('userToken')
      }
    },

    setIsAuthenticated(status) {
      this.isAuthenticated = !!status
      if (!status) this.setToken('')
    },

    setUserRole(role) {
      this.userRole = role
      localStorage.setItem('userRole', role)
    },

    setUserId(id) {
      this.userId = id ?? null
      if (id == null) localStorage.removeItem('userId')
      else localStorage.setItem('userId', String(id))
    },

    setUserName(name) {
      this.userName = name || ''
      if (!name) localStorage.removeItem('userName')
      else localStorage.setItem('userName', String(name))
    },

    setUserInfo(info) {
      this.userInfo = info || {}
    },

    logout() {
      this.setToken('')
      this.setUserId(null)
      this.setUserName('')
      this.userInfo = {}
      // 如需一起清角色可開啟下一行
      // localStorage.removeItem('userRole')
    },
  },
})