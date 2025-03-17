import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/components/app-layout"

export default function PricingPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Pricing
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your creative needs. All plans include access to our AI design tools and
              virtual try-on features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/30 border border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-white/70 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">20 AI design generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Standard resolution designs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Virtual try-on for wall art</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Basic prompt enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/30 border-purple-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-1 px-4 rounded-full">
                Most Popular
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-white/70 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">100 AI design generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">High resolution designs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Virtual try-on for wall art and apparel</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Advanced prompt enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Priority email support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">10% discount on all orders</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/30 border border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$49.99</span>
                  <span className="text-white/70 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Unlimited AI design generations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Ultra-high resolution designs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">All virtual try-on features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Premium prompt enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Dedicated support manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">20% discount on all orders</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">What's included in the free trial?</h3>
                <p className="text-white/70">
                  Our 7-day free trial includes 10 AI design generations, access to basic virtual try-on features, and
                  standard resolution designs. No credit card required to start.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Can I change plans at any time?</h3>
                <p className="text-white/70">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your plan will take
                  effect at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Do I own the designs I create?</h3>
                <p className="text-white/70">
                  Yes, you retain full ownership of all designs created using our platform. You can use them for
                  personal or commercial purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">What payment methods do you accept?</h3>
                <p className="text-white/70">
                  We accept all major credit cards, PayPal, and Apple Pay. Enterprise customers can also pay by invoice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Is there a limit to how many designs I can save?</h3>
                <p className="text-white/70">
                  All plans include unlimited design storage. You can save as many designs as you want, even if you
                  don't use them right away. You can save as many designs as you want, even if you don't use them right
                  away.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Do you offer refunds?</h3>
                <p className="text-white/70">
                  We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support
                  team to request a refund.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Ready to unleash your creativity?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Start creating stunning AI-generated designs today with our risk-free trial. No credit card required.
            </p>
            <Button className="bg-white text-purple-900 hover:bg-white/90 rounded-full px-8">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

