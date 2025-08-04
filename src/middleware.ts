import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login and register pages without authentication
        if (req.nextUrl.pathname.startsWith("/login") || 
            req.nextUrl.pathname.startsWith("/register") ||
            req.nextUrl.pathname.startsWith("/api/register")) {
          return true
        }

        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith("/admin") || 
            req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        // Allow access to other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"]
}
