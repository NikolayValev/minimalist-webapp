"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCollection() {
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("collections")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/collections/${data.id}`)
    } catch (error) {
      console.error("Error creating collection:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">Please sign in to create collections.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter collection title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your collection"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading || !title.trim()}>
                  {loading ? "Creating..." : "Create Collection"}
                </Button>
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
