"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, this would call an API to subscribe the user
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      })

      setTimeout(() => {
        setIsSuccess(false)
        setEmail("")
      }, 3000)
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex">
        <Input
          type="email"
          placeholder="Your email address"
          className="bg-white/5 border-white/10 text-white rounded-l-md focus-visible:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || isSuccess}
          required
        />
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="bg-green-600 text-white flex items-center justify-center px-3 rounded-r-md"
            >
              <CheckCircle className="h-4 w-4" />
            </motion.div>
          ) : (
            <Button
              type="submit"
              className="rounded-l-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </AnimatePresence>
      </div>
      <p className="text-white/50 text-xs">
        By subscribing, you agree to our Privacy Policy and consent to receive updates.
      </p>
    </form>
  )
}

