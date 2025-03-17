"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-purple-900 border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
              ARTISTRY AI
            </div>
            <p className="text-white/60 mb-6 max-w-md">
              Transforming spaces with AI-generated wall art that captures your unique vision and style.
            </p>
            <div className="flex space-x-4">
              {["twitter", "instagram", "facebook", "youtube"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 hover:bg-white/10 transition-colors"
                  aria-label={`Visit our ${social} page`}
                >
                  {social === "twitter" && <Twitter className="h-5 w-5 text-white/60" />}
                  {social === "instagram" && <Instagram className="h-5 w-5 text-white/60" />}
                  {social === "facebook" && <Facebook className="h-5 w-5 text-white/60" />}
                  {social === "youtube" && <Youtube className="h-5 w-5 text-white/60" />}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Navigation</h3>
            <ul className="space-y-3">
              {["Home", "Gallery", "Process", "Materials", "About"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-white/60 hover:text-white transition-colors">
                  Copyright
                </Link>
              </li>
              <li className="text-white/60 mt-6">contact@artistryai.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40">
          <p>© {currentYear} Artistry AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

