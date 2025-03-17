"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck } from "lucide-react"
import Link from "next/link"
import CheckoutSteps from "@/components/checkout-steps"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <CheckoutSteps currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/try-on">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Try-On
                  </Link>
                </Button>
                <Button onClick={handleNextStep}>
                  Continue to Shipping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="standard" className="space-y-4">
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-sm text-muted-foreground">Delivery in 5-7 business days</div>
                    </Label>
                    <div className="font-medium">$9.99</div>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-muted-foreground">Delivery in 2-3 business days</div>
                    </Label>
                    <div className="font-medium">$14.99</div>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="overnight" id="overnight" />
                    <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                      <div className="font-medium">Overnight Shipping</div>
                      <div className="text-sm text-muted-foreground">Delivery next business day</div>
                    </Label>
                    <div className="font-medium">$24.99</div>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Information
                </Button>
                <Button onClick={handleNextStep}>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm">Secure Payment Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg?height=30&width=40&text=Visa" alt="Visa" className="h-6" />
                    <img src="/placeholder.svg?height=30&width=40&text=MC" alt="Mastercard" className="h-6" />
                    <img src="/placeholder.svg?height=30&width=40&text=Amex" alt="American Express" className="h-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiration Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>

                <div className="pt-4">
                  <Label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Save this card for future purchases</span>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Shipping
                </Button>
                <Button asChild>
                  <Link href="/order-complete">
                    Complete Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=80&width=80&text=Wall+Art"
                    alt="Wall art thumbnail"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Custom Wall Art Design</h3>
                  <p className="text-sm text-muted-foreground">Size: Medium (18×24″), Canvas Print</p>
                  <p className="text-sm text-muted-foreground">Qty: 1</p>
                </div>
                <div className="font-medium">$79.99</div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$79.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$7.20</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>$97.18</span>
              </div>

              <div className="pt-4">
                <Input placeholder="Discount code" />
                <Button variant="outline" className="w-full mt-2">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

