import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMockMode: boolean;
  login: (user: User) => void;
  mockLogin: (user: User) => void;
  logout: () => void;
  updateTokens: (accessToken: string, expiresAt: number, refreshToken?: string) => void;
  checkAuthStatus: () => Promise<boolean>;
  syncAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isMockMode: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false, isMockMode: false });
      },

      mockLogin: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false, isMockMode: true });
      },

      logout: async () => {
        const { isMockMode } = get();

        if (!isMockMode) {
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include", // CRITICAL: Include cookies
            });
          } catch (error) {
            console.error("Logout error:", error);
          }
        }

        set({ user: null, isAuthenticated: false, isLoading: false, isMockMode: false });
      },

      updateTokens: (accessToken: string, expiresAt: number, refreshToken?: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              accessToken,
              expiresAt,
              ...(refreshToken && { refreshToken }),
            },
          });
        }
      },

      checkAuthStatus: async () => {
        const { isMockMode } = get();

        if (isMockMode) {
          return true;
        }

        try {
          set({ isLoading: true });

          // CRITICAL: Include credentials to send cookies
          const response = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();

            if (userData.authenticated) {
              get().login({
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                accessToken: userData.accessToken,
                expiresAt: userData.expiresAt || Date.now() + 3600000,
              });
              return true;
            } else {
              // Not authenticated, try refresh
              const refreshResponse = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include", // CRITICAL: Include credentials
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                get().login({
                  email: refreshData.email,
                  name: refreshData.name,
                  picture: refreshData.picture,
                  accessToken: refreshData.accessToken,
                  expiresAt: refreshData.expiresAt,
                });
                return true;
              } else {
                get().logout();
                return false;
              }
            }
          } else if (response.status === 401) {
            // Try to refresh token
            const refreshResponse = await fetch("/api/auth/refresh", {
              method: "POST",
              credentials: "include", // CRITICAL: Include credentials
            });

            if (refreshResponse.ok) {
              const userData = await refreshResponse.json();
              get().login({
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                accessToken: userData.accessToken,
                expiresAt: userData.expiresAt,
              });
              return true;
            } else {
              get().logout();
              return false;
            }
          } else {
            get().logout();
            return false;
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          get().logout();
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      syncAuth: () => {
        const { checkAuthStatus } = get();
        checkAuthStatus();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isMockMode: state.isMockMode,
      }),
    }
  )
);
