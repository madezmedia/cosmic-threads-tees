"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RetroNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-chrome/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-8 mr-2">
              <div className="absolute inset-0 bg-gradient-to-r from-magenta to-teal rounded-full blur opacity-70"></div>
              <div className="relative h-full w-full bg-black rounded-full border border-chrome/30 flex items-center justify-center">
                <div className="h-2 w-2 bg-teal rounded-full"></div>
              </div>
            </div>
            <span className="font-display text-xl font-bold text-chrome">COSMIC THREADS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["DESIGNS", "HOW IT WORKS", "GALLERY", "ABOUT"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-mono text-sm text-chrome/70 hover:text-teal transition-colors uppercase tracking-wider"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Button className="bg-transparent hover:bg-magenta/10 text-magenta border border-magenta/30 font-mono text-sm uppercase tracking-wider">
              Start Designing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-chrome/70 hover:text-teal" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-black/95 backdrop-blur-md z-40 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
          {["DESIGNS", "HOW IT WORKS", "GALLERY", "ABOUT"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono text-lg text-chrome/70 hover:text-teal transition-colors uppercase tracking-wider py-2 border-b border-chrome/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Button className="bg-transparent hover:bg-magenta/10 text-magenta border border-magenta/30 font-mono text-sm uppercase tracking-wider mt-4 w-full">
            Start Designing
          </Button>
        </nav>
      </div>
    </header>
  )
}

