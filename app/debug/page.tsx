"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"

export default function DebugPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchDebugData()
  }, [])

  const fetchDebugData = async () => {
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase.from("profiles").select("*")

      console.log("Profiles:", { data: profilesData, error: profilesError })
      setProfiles(profilesData || [])

      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase.from("collections").select("*")

      console.log("Collections:", { data: collectionsData, error: collectionsError })
      setCollections(collectionsData || [])

      // Fetch collection items
      const { data: itemsData, error: itemsError } = await supabase.from("collection_items").select("*")

      console.log("Collection Items:", { data: itemsData, error: itemsError })
      setItems(itemsData || [])
    } catch (error) {
      console.error("Debug fetch error:", error)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-2xl font-bold mb-8">Debug Page</h1>

        <div className="space-y-8">
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
