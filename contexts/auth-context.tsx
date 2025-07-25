"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface UserProfile {
  id: string
  username: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      return null
    }
  }

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
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }

        // Handle URL fragments from implicit flow (fallback)
        if (window.location.hash.includes("access_token")) {
          console.log("Handling implicit flow tokens from URL hash")
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
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("Auth state change:", event, !!session?.user)

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Fetch profile data when user signs in
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        } else {
          setProfile(null)
        }
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
              role: 'user', // Default role
            })

            if (insertError) {
              console.error("Error creating profile:", insertError)
            } else {
              // Fetch the newly created profile
              const newProfile = await fetchUserProfile(session.user.id)
              if (newProfile) {
                setProfile(newProfile)
              }
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
      // Use implicit flow as fallback since PKCE seems to have issues
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
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
    setProfile(null)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider 
      value={{ user, profile, loading, isAdmin, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
