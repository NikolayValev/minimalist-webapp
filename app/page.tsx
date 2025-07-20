"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ImageIcon, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"

interface Collection {
  id: string
  title: string
  description: string | null
  created_at: string
  collection_items: Array<{
    id: string
    type: string
    content: string
    rank: number
    description?: string
  }>
}

export default function Home() {
  const { user, loading } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [exampleCollections, setExampleCollections] = useState<Collection[]>([])
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Check for auth errors in URL
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get("error")
    const message = urlParams.get("message")

    if (error) {
      setAuthError(message || error)
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserCollections()
    } else {
      fetchExampleCollections()
    }
  }, [user])

  const fetchUserCollections = async () => {
    if (!user) return

    setLoadingCollections(true)
    try {
      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          collection_items (
            id,
            type,
            content,
            rank,
            description
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user collections:", error)
      } else {
        // Sort items by rank within each collection
        const collectionsWithSortedItems = data.map((collection) => ({
          ...collection,
          collection_items: collection.collection_items.sort((a, b) => a.rank - b.rank),
        }))
        setCollections(collectionsWithSortedItems)
      }
    } catch (error) {
      console.error("Unexpected error fetching user collections:", error)
    } finally {
      setLoadingCollections(false)
    }
  }

  const fetchExampleCollections = async () => {
    setLoadingCollections(true)
    try {
      console.log("Fetching example collections...")

      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          collection_items (
            id,
            type,
            content,
            rank,
            description
          )
        `)
        .eq("user_id", "00000000-0000-0000-0000-000000000000")
        .order("created_at", { ascending: false })

      console.log("Example collections query result:", { data, error })

      if (error) {
        console.error("Error fetching example collections:", error)
      } else {
        // Sort items by rank within each collection
        const collectionsWithSortedItems = data.map((collection) => ({
          ...collection,
          collection_items: collection.collection_items.sort((a, b) => a.rank - b.rank),
        }))
        console.log("Processed example collections:", collectionsWithSortedItems)
        setExampleCollections(collectionsWithSortedItems)
      }
    } catch (error) {
      console.error("Unexpected error fetching example collections:", error)
    } finally {
      setLoadingCollections(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-8">{authError}</p>
          <Button onClick={() => setAuthError(null)}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">Create Beautiful Collections</h1>
            <p className="text-xl text-gray-600 mb-8">Organize your images and links into ranked collections</p>
            <div className="text-gray-500">Sign in to get started</div>
          </div>

          {/* Example Collections */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Example Collections</h2>
            {loadingCollections ? (
              <div className="text-center py-8 text-gray-500">Loading examples...</div>
            ) : exampleCollections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No example collections found.</p>
                <p className="text-sm text-gray-400">Make sure to run the seed script to add example data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exampleCollections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{collection.title}</CardTitle>
                      {collection.description && <p className="text-sm text-gray-600">{collection.description}</p>}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {collection.collection_items.slice(0, 6).map((item) => (
                          <div key={item.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                            {item.type === "image" ? (
                              <Image
                                src={item.content || "/placeholder.svg"}
                                alt={item.description || ""}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=100&width=100"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-blue-50">
                                <ExternalLink className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        ))}
                        {collection.collection_items.length > 6 && (
                          <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                            +{collection.collection_items.length - 6}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-gray-500">{collection.collection_items.length} items</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">Your Collections</h1>
          <Link href="/collections/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </Link>
        </div>

        {loadingCollections ? (
          <div className="text-center py-8 text-gray-500">Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-500 mb-4">Create your first collection to get started</p>
            <Link href="/collections/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{collection.title}</CardTitle>
                    {collection.description && <p className="text-sm text-gray-600">{collection.description}</p>}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {collection.collection_items.slice(0, 6).map((item) => (
                        <div key={item.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                          {item.type === "image" ? (
                            <Image
                              src={item.content || "/placeholder.svg"}
                              alt={item.description || ""}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=100&width=100"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-blue-50">
                              <ExternalLink className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                      {collection.collection_items.length > 6 && (
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                          +{collection.collection_items.length - 6}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-gray-500">{collection.collection_items.length} items</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
