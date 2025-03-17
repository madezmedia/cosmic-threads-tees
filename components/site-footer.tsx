"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react"

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                ARTISTRY AI
              </span>
            </Link>
            <p className="text-white/70 text-sm">
              Transform your space with AI-generated wall art that captures your unique vision and style.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/design" className="text-white/70 hover:text-white transition-colors text-sm">
                Create Art
              </Link>
              <Link href="/gallery" className="text-white/70 hover:text-white transition-colors text-sm">
                Gallery
              </Link>
              <Link href="/try-on" className="text-white/70 hover:text-white transition-colors text-sm">
                Try On Wall
              </Link>
              <Link href="/how-it-works" className="text-white/70 hover:text-white transition-colors text-sm">
                How It Works
              </Link>
              <Link href="/pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  123 Art Street, Creative District
                  <br />
                  San Francisco, CA 94103
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                <span className="text-white/70 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@artistryai.com"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  info@artistryai.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-white/70 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-white/70 hover:text-white transition-colors text-sm">
                Accessibility
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/50 text-sm">© {currentYear} Artistry AI. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

