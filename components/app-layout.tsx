"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User, LogIn, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/context/app-context"
import SiteFooter from "@/components/site-footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, cart, logout } = useApp()
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Design", href: "/design" },
    { name: "Try On Wall", href: "/try-on" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                ARTISTRY AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm tracking-wider ${
                    pathname === item.href
                      ? "text-white font-medium"
                      : "text-white/70 hover:text-white transition-colors"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                      <User className="h-5 w-5 mr-2" />
                      {user?.full_name || user?.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}

              <Button className="bg-white text-black hover:bg-white/90 rounded-full relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Button className="bg-white text-black hover:bg-white/90 rounded-full relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-md md:hidden">
          <nav className="p-6 pt-10 flex flex-col h-full">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`py-3 px-4 text-lg ${
                  pathname === item.href ? "text-white font-medium bg-white/10 rounded-lg" : "text-white/70"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-6 border-t border-white/10 pt-6">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="py-3 px-4 text-lg text-white/70 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link href="/orders" className="py-3 px-4 text-lg text-white/70 flex items-center">
                    Orders
                  </Link>
                  <Link href="/profile" className="py-3 px-4 text-lg text-white/70 flex items-center">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-3 px-4 text-lg text-white/70 flex items-center w-full text-left"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="py-3 px-4 text-lg text-white/70 flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Login / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}

