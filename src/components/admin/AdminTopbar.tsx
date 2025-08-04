"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function AdminTopbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Get page title based on current path
  const getPageTitle = () => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard'
      case '/admin/users':
        return 'User Management'
      case '/admin/analytics':
        return 'Analytics'
      case '/admin/settings':
        return 'Settings'
      default:
        if (pathname.startsWith('/admin/users/')) {
          return 'User Management'
        }
        return 'Admin Panel'
    }
  }

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length <= 1) return null
    
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Admin</span>
        {segments.slice(1).map((segment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="capitalize">{segment.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Page title and breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          {getBreadcrumb()}
        </div>

        {/* Right side - User profile and actions */}
        <div className="flex items-center space-x-4">
          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.email}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    // Add profile settings navigation here
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  )
}
