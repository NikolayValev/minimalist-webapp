"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminCheck } from "@/hooks/use-admin"

interface Profile {
  id: string
  username: string
  role: 'user' | 'admin'
  created_at: string
}

export function AdminUserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { hasAdminAccess } = useAdminCheck()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (hasAdminAccess) {
      fetchProfiles()
    }
  }, [hasAdminAccess])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, role, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        setProfiles(data || [])
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error('Error updating role:', error)
        alert('Failed to update user role')
      } else {
        // Update local state
        setProfiles(profiles.map(profile => 
          profile.id === userId 
            ? { ...profile, role: newRole }
            : profile
        ))
        alert(`User role updated to ${newRole}`)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Failed to update user role')
    }
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!hasAdminAccess) {
    return <div>Access denied</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded border">
        <div className="grid grid-cols-4 gap-4 p-4 border-b font-semibold">
          <div>Username</div>
          <div>Role</div>
          <div>Created</div>
          <div>Actions</div>
        </div>

        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
            <div>{profile.username}</div>
            <div>
              <span className={`px-2 py-1 rounded text-xs ${
                profile.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.role}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(profile.created_at).toLocaleDateString()}
            </div>
            <div>
              <Button
                size="sm"
                variant={profile.role === 'admin' ? 'destructive' : 'default'}
                onClick={() => toggleAdminRole(profile.id, profile.role)}
              >
                {profile.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
              </Button>
            </div>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}
