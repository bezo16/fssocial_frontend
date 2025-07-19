import { NextResponse, NextRequest } from "next/server"
import verifyJwtToken from "./lib/auth/verifyJwtToken"

// This function can be marked `async` if using `await` inside
// Authorization middleware
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")
  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url))

  try {
    await verifyJwtToken(token.value)
  }
  catch (error) {
    console.error("JWT verification failed:", error)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: ["/feed", "/profile/:path*"],
}
