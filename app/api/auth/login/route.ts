import { NextRequest, NextResponse } from "next/server"
import axiosApiCall from "@/lib/api/axiosApiCall"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = await axiosApiCall.post("/auth/login", body)
    const token = response.data?.token
    const cookieStore = await cookies()

    cookieStore.set("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: true,
    })
    return NextResponse.json(response.data, { status: 200 })
  }
  catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 401 })
  }
}
