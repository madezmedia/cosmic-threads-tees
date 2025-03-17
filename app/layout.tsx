import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import { AppProvider } from "@/context/app-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Artistry AI - AI-Generated Wall Art",
  description: "Transform your space with AI-generated wall art that captures your unique vision and style.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <CookieConsent />
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}



import './globals.css'