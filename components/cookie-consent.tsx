"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent") === "accepted"

    if (!hasAccepted) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg mb-2">Cookie Consent</h3>
                <p className="text-white/70 text-sm">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
                  traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={declineCookies}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={acceptCookies}
                >
                  Accept All
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 md:hidden text-white/70 hover:text-white hover:bg-white/10"
                  onClick={declineCookies}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

