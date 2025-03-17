"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function RetroFooter() {
  return (
    <footer className="bg-black border-t border-chrome/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute inset-0 bg-gradient-to-r from-magenta to-teal rounded-full blur opacity-70"></div>
                <div className="relative h-full w-full bg-black rounded-full border border-chrome/30 flex items-center justify-center">
                  <div className="h-2 w-2 bg-teal rounded-full"></div>
                </div>
              </div>
              <span className="font-display text-xl font-bold text-chrome">COSMIC THREADS</span>
            </div>
            <p className="text-chrome/60 mb-6 max-w-md">
              Bringing the optimistic vision of tomorrow from yesterday into today's fashion. Retro-futuristic t-shirt
              designs for the modern age.
            </p>
            <div className="flex space-x-4">
              {["twitter", "instagram", "pinterest", "tiktok"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-chrome/20 flex items-center justify-center hover:border-teal transition-colors"
                  aria-label={`Visit our ${social} page`}
                >
                  <div className="w-3 h-3 bg-chrome/60 hover:bg-teal transition-colors"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-magenta mb-4">Navigation</h3>
            <ul className="space-y-2">
              {["Home", "Designs", "How It Works", "Gallery", "About"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-chrome/60 hover:text-teal transition-colors font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-teal mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-chrome/60 font-light">Cosmic Tower</li>
              <li className="text-chrome/60 font-light">Atomic Avenue</li>
              <li className="text-chrome/60 font-light">Future City, FC 2099</li>
              <li className="text-chrome/60 font-light mt-4">contact@cosmic-threads.com</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-chrome/10">
          <p className="text-chrome/40 text-sm font-light mb-4 md:mb-0">
            © {new Date().getFullYear()} Cosmic Threads. All rights reserved.
          </p>
          <Button
            variant="outline"
            size="icon"
            className="border-chrome/20 text-chrome/60 hover:text-teal hover:border-teal"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

