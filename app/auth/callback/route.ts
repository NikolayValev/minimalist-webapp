import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful authentication, redirect to home
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } else {
      console.error("Auth error:", error)
      // Redirect to error page or home with error
      return NextResponse.redirect(new URL("/?error=auth_failed", requestUrl.origin))
    }
  }

  // No code parameter, redirect to home
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
