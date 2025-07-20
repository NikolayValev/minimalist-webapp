import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  console.log("Auth callback received:", {
    code: code ? "present" : "missing",
    error,
    errorDescription,
    fullUrl: request.url,
  })

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      new URL(`/?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin),
    )
  }

  if (code) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      console.log("Code exchange result:", {
        success: !exchangeError,
        error: exchangeError?.message,
        hasSession: !!data.session,
        hasUser: !!data.user,
        userId: data.user?.id,
      })

      if (!exchangeError && data.session) {
        // Create the response with redirect
        const response = NextResponse.redirect(new URL("/", requestUrl.origin))

        // Set session cookies manually to ensure they persist
        if (data.session.access_token && data.session.refresh_token) {
          response.cookies.set("sb-access-token", data.session.access_token, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          })

          response.cookies.set("sb-refresh-token", data.session.refresh_token, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          })
        }

        return response
      } else {
        console.error("Auth exchange error:", exchangeError)
        // If PKCE fails, redirect to home and let implicit flow handle it
        return NextResponse.redirect(new URL("/", requestUrl.origin))
      }
    } catch (err) {
      console.error("Unexpected error during code exchange:", err)
      // If PKCE fails, redirect to home and let implicit flow handle it
      return NextResponse.redirect(new URL("/", requestUrl.origin))
    }
  }

  // No code parameter, redirect to home
  console.log("No code parameter found, redirecting to home")
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
