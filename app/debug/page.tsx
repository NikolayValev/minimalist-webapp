"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { useAdminCheck } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { AdminUserManagement } from "@/components/admin-user-management"
import Link from "next/link"

export default function DebugPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()
  
  const { hasAdminAccess, loading: authLoading, isAuthenticated } = useAdminCheck()

  useEffect(() => {
    // Only fetch data if user has admin access
    if (hasAdminAccess && !authLoading) {
      fetchDebugData()
    } else if (!authLoading && !hasAdminAccess) {
      setLoading(false)
    }
  }, [hasAdminAccess, authLoading])

  const fetchDebugData = async () => {
    try {
      // Only fetch limited data and remove sensitive console logs
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, role, created_at")

      if (profilesError) {
        console.error("Profiles error:", profilesError.message)
      } else {
        setProfiles(profilesData || [])
      }

      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("id, user_id, title, created_at")

      if (collectionsError) {
        console.error("Collections error:", collectionsError.message)
      } else {
        setCollections(collectionsData || [])
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("collection_items")
        .select("id, collection_id, type, rank, created_at")

      if (itemsError) {
        console.error("Items error:", itemsError.message)
      } else {
        setItems(itemsData || [])
      }
    } catch (error) {
      console.error("Debug fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
          <p>Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
          <p className="text-red-600 mb-4">Please sign in to access this page.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
          <p className="text-red-600 mb-4">Access denied. Admin privileges required.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
          <p>Loading debug data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Debug Page - Admin Access</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <p className="text-blue-800">
            <strong>⚠️ Admin Only:</strong> This page contains sensitive system information and should only be accessible to administrators.
          </p>
        </div>

        <div className="space-y-8">
          <AdminUserManagement />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Profiles ({profiles.length})</h2>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-auto">{JSON.stringify(profiles, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Collections ({collections.length})</h2>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-auto">{JSON.stringify(collections, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Collection Items ({items.length})</h2>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-auto">{JSON.stringify(items, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
