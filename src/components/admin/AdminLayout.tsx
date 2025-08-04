"use client"

import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar - Fixed full height */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <AdminTopbar />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
