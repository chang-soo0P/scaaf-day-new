"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, user, isMockMode, mockLogin, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleMockLogin = async () => {
    try {
      setIsLoading(true)
      // Mock user data for development
      const mockUser = {
        email: "demo@example.com",
        name: "Demo User",
        picture: "https://via.placeholder.com/40",
        accessToken: "mock_access_token",
        expiresAt: Date.now() + 3600000, // 1 hour from now
      }

      mockLogin(mockUser)
      // router.push("/digest")
    } catch (error) {
      console.error("Mock login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/google")
      const { authUrl } = await response.json()

      if (authUrl) {
        window.location.href = authUrl
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    router.push("/digest")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Welcome to Action Inbox</CardTitle>
          <CardDescription>
            {isAuthenticated ? "You're already signed in" : "Sign in to access your Gmail AI agent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.picture || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-green-800">{user?.name}</p>
                    <p className="text-sm text-green-600">{user?.email}</p>
                    <p className="text-xs text-green-500">{isMockMode ? "Demo Mode" : "Google Account"}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={isLoading}
              >
                Continue to App
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or switch account</span>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-12 text-base font-medium bg-transparent"
                size="lg"
                disabled={isLoading}
              >
                Sign Out & Use Different Account
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={handleMockLogin}
                className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700"
                size="lg"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {isLoading ? "Signing in..." : "Demo Login (Mock Data)"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-12 text-base font-medium bg-transparent"
                size="lg"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77C17.45 20.53 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google (Real)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Use Demo Login for development with mock data, or Google for real Gmail integration
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
