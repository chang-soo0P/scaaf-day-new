import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
  email: string
  name: string
  picture?: string
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isMockMode: boolean // Added mock mode flag
  login: (user: User) => void
  mockLogin: (user: User) => void // Added mock login function
  logout: () => void
  updateTokens: (accessToken: string, expiresAt: number, refreshToken?: string) => void
  checkAuthStatus: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isMockMode: false, // Mock mode disabled - use real Gmail data only

      login: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false, isMockMode: false })
      },

      mockLogin: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false, isMockMode: true })
      },

      logout: async () => {
        const { isMockMode } = get()

        if (!isMockMode) {
          try {
            await fetch("/api/auth/logout", { method: "POST" })
          } catch (error) {
            console.error("Logout error:", error)
          }
        }

        set({ user: null, isAuthenticated: false, isLoading: false, isMockMode: false })
      },

      updateTokens: (accessToken: string, expiresAt: number, refreshToken?: string) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              accessToken,
              expiresAt,
              ...(refreshToken && { refreshToken }),
            },
          })
        }
      },

      checkAuthStatus: async () => {
        const { isMockMode } = get()

        if (isMockMode) {
          return true
        }

        try {
          set({ isLoading: true })
          const response = await fetch("/api/auth/me")
          
          if (response.ok) {
            const userData = await response.json()
            get().login({
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
              accessToken: userData.accessToken,
              expiresAt: userData.expiresAt,
            })
            return true
          } else if (response.status === 401) {
            // Try to refresh token
            const refreshResponse = await fetch("/api/auth/refresh", {
              method: "POST",
            })
            
            if (refreshResponse.ok) {
              const userData = await refreshResponse.json()
              get().login({
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                accessToken: userData.accessToken,
                expiresAt: userData.expiresAt,
              })
              return true
            } else {
              get().logout()
              return false
            }
          } else {
            get().logout()
            return false
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          get().logout()
          return false
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Updated storage to use sessionStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isMockMode: state.isMockMode, // Persist mock mode
      }),
    },
  ),
)
