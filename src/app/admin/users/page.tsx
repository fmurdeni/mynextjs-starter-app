"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"

interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Check authentication and authorization
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  // Fetch users
  const fetchUsers = async (page: number = 1, search: string = "", isSearch: boolean = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true)
      } else if (page === 1 && !search) {
        setLoading(true)
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      })

      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetchUsers()
    }
  }, [session])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, searchTerm, true)
  }

  // Handle delete
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers(currentPage, searchTerm)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete user")
      }
    } catch {
      alert("An error occurred while deleting the user")
    }
  }

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <AdminLayout>
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Users
                </h2>
                <p className="text-gray-600 text-lg">Manage system users and their roles</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{users.length} total users</span>
                  </span>
                </div>
              </div>
              <Link
                href="/admin/users/create"
                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="relative w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="relative font-semibold">Add New User</span>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    searchLoading 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {searchLoading ? (
                    <div className="relative w-5 h-5 mr-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    </div>
                  ) : (
                    <svg className="relative w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  <span className="relative font-semibold">{searchLoading ? 'Searching...' : 'Search'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {/* Skeleton loading list items */}
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No users found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div 
                    key={user.id} 
                    className="group bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-0.5"
                    style={{animationDelay: `${index * 30}ms`}}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side - User info */}
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ${
                          user.role === "ADMIN" 
                            ? "bg-gradient-to-r from-purple-500 to-purple-600" 
                            : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                        }`}>
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {user.name || "No name"}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.role === "ADMIN" 
                                ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800" 
                                : "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                        </div>
                      </div>

                      {/* Right side - Actions and date */}
                      <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4m0-10V7" />
                          </svg>
                          <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="group/btn relative inline-flex items-center justify-center p-2 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border border-indigo-200 rounded-lg hover:bg-indigo-50"
                            title="Edit user"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          {user.id !== session.user.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="group/btn relative inline-flex items-center justify-center p-2 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border border-red-200 rounded-lg hover:bg-red-50"
                              title="Delete user"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="group relative inline-flex items-center justify-center w-10 h-10 overflow-hidden font-medium text-gray-600 transition duration-300 ease-out bg-white/80 rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-indigo-300"
                  >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          page === currentPage
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                            : "bg-white/80 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        {page}
                        {page === currentPage && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="group relative inline-flex items-center justify-center w-10 h-10 overflow-hidden font-medium text-gray-600 transition duration-300 ease-out bg-white/80 rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-indigo-300"
                  >
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
    </AdminLayout>
  )
}
