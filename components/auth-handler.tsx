"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    // Clean up URL fragments after auth
    if (window.location.hash.includes("access_token")) {
      // Clear the hash and redirect to clean URL
      window.history.replaceState(null, "", window.location.pathname)
      router.refresh()
    }
  }, [router])

  return null
}
