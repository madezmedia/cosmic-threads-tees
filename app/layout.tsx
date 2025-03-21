import type React from "react"
import "./globals.css"
import { Inter, Space_Mono } from "next/font/google"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import { AppProvider } from "@/context/app-context"
import { Toaster } from "@/components/ui/toaster"
import { TanStackProvider } from "@/lib/query-client"

// Font configuration for our three-tier typography system
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

const retroFuture = localFont({
  src: "../public/fonts/retrofuture.woff2",
  variable: "--font-retro-future",
  display: "swap",
})

export const metadata = {
  title: "Cosmic Threads - AI-Generated T-Shirts & Wall Art",
  description: "Create unique, AI-generated designs for t-shirts and wall art with our retro-futuristic design platform.",
  generator: 'Cosmic Threads'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${spaceMono.variable} ${retroFuture.variable}`}
    >
      <body className="min-h-screen bg-deepSpace text-foreground">
        <AppProvider>
          <TanStackProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
              <CookieConsent />
              <Toaster />
            </ThemeProvider>
          </TanStackProvider>
        </AppProvider>
      </body>
    </html>
  )
}
