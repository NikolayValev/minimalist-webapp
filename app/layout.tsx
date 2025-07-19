import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthHandler } from "@/components/auth-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Collections",
  description: "Create and organize your collections",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthHandler />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
