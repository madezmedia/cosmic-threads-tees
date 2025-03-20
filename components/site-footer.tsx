"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react"
import RetroGrid from "@/components/retro-grid"
import RetroOrbit from "@/components/retro-orbit"

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deepSpace border-t border-silverChrome/10 mt-20 relative overflow-hidden">
      <RetroGrid className="absolute inset-0 opacity-5 z-0" />
      <div className="absolute inset-0 z-0 opacity-10">
        <RetroOrbit />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4 relative z-10">
            <Link href="/" className="flex items-center">
              <span className="font-display text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cosmicPurple via-magentaGlow to-neonTeal">
                COSMIC THREADS
              </span>
            </Link>
            <p className="text-silverChrome text-sm font-mono">
              AI-generated t-shirt designs from the retro-future. Unique cosmic apparel for the digital age.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-deepSpace/50 border border-silverChrome/20 flex items-center justify-center text-silverChrome hover:bg-neonTeal/10 hover:border-neonTeal/30 hover:text-neonTeal transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-deepSpace/50 border border-silverChrome/20 flex items-center justify-center text-silverChrome hover:bg-neonTeal/10 hover:border-neonTeal/30 hover:text-neonTeal transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-deepSpace/50 border border-silverChrome/20 flex items-center justify-center text-silverChrome hover:bg-neonTeal/10 hover:border-neonTeal/30 hover:text-neonTeal transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-deepSpace/50 border border-silverChrome/20 flex items-center justify-center text-silverChrome hover:bg-neonTeal/10 hover:border-neonTeal/30 hover:text-neonTeal transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 relative z-10">
            <h3 className="text-neonTeal font-mono text-lg uppercase tracking-wider">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/create" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Design T-Shirt
              </Link>
              <Link href="/gallery" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Gallery
              </Link>
              <Link href="/try-on" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Virtual Try-On
              </Link>
              <Link href="/how-it-works" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                How It Works
              </Link>
              <Link href="/pricing" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 relative z-10">
            <h3 className="text-neonTeal font-mono text-lg uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-magentaGlow mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-silverChrome text-sm font-mono">
                  456 Digital Avenue
                  <br />
                  Neon District, CA 94103
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-magentaGlow mr-2 flex-shrink-0" />
                <span className="text-silverChrome text-sm font-mono">+1 (800) COSMIC-88</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-magentaGlow mr-2 flex-shrink-0" />
                <a
                  href="mailto:hello@cosmicthreads.com"
                  className="text-silverChrome text-sm font-mono hover:text-neonTeal transition-colors"
                >
                  hello@cosmicthreads.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 relative z-10">
            <h3 className="text-neonTeal font-mono text-lg uppercase tracking-wider">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-silverChrome hover:text-neonTeal transition-colors text-sm font-mono uppercase">
                Accessibility
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-silverChrome/10 py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-silverChrome/50 text-sm font-mono">© {currentYear} COSMIC THREADS. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-mono text-silverChrome/50">
              <Link href="/terms" className="hover:text-neonTeal transition-colors uppercase tracking-wider">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-neonTeal transition-colors uppercase tracking-wider">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-neonTeal transition-colors uppercase tracking-wider">
                Cookies
              </Link>
              <Link href="/accessibility" className="hover:text-neonTeal transition-colors uppercase tracking-wider">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
