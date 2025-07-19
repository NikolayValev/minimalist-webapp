"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // First, try to get existing session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("Initial session check:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: sessionError?.message,
        })

        if (session?.user && mounted) {
          setUser(session.user)
        }

        // Handle URL fragments from implicit flow (fallback)
        if (window.location.hash.includes("access_token")) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get("access_token")
          const refreshToken = hashParams.get("refresh_token")

          if (accessToken && refreshToken) {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })

              if (!error && data.user && mounted) {
                setUser(data.user)
                // Clean up URL
                window.history.replaceState(null, "", window.location.pathname)
              }
            } catch (error) {
              console.error("Error setting session from URL:", error)
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session?.user)

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }

      // Create profile on sign up
      if (event === "SIGNED_IN" && session?.user) {
        try {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (!profile) {
            const { error: insertError } = await supabase.from("profiles").insert({
              id: session.user.id,
              username: session.user.user_metadata.full_name || session.user.email?.split("@")[0] || "user",
              avatar_url: session.user.user_metadata.avatar_url,
            })

            if (insertError) {
              console.error("Error creating profile:", insertError)
            }
          }
        } catch (error) {
          console.error("Error handling profile creation:", error)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("OAuth initiation error:", error)
      }
    } catch (err) {
      console.error("Unexpected OAuth error:", err)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
