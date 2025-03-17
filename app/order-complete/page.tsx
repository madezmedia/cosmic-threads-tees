import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ShoppingBag } from "lucide-react"
import SocialShare from "@/components/social-share"

export default function OrderCompletePage() {
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)
  const orderDate = new Date().toLocaleDateString()

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Complete!</h1>
        <p className="text-muted-foreground max-w-md">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{orderDate}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            <div className="flex items-center space-x-4 border rounded-lg p-4">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=64&width=64&text=Wall+Art"
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
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
            <div className="border rounded-lg p-4">
              <p>John Doe</p>
              <p>123 Main St</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Payment Information</p>
            <div className="border rounded-lg p-4 flex items-center">
              <img src="/placeholder.svg?height=30&width=40&text=Visa" alt="Visa" className="h-6 mr-2" />
              <span>•••• •••• •••• 1234</span>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
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
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>$97.18</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" asChild>
            <Link href="/order-tracking">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Track Your Order
            </Link>
          </Button>
          <div className="flex items-center justify-center w-full">
            <span className="text-sm text-muted-foreground mr-2">Share your creation:</span>
            <SocialShare />
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="font-medium mb-2">Track Your Order</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive tracking information via email once your order ships.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="font-medium mb-2">Create More Designs</h3>
              <p className="text-sm text-muted-foreground">
                Continue exploring our AI design tool to create more unique wall art.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="font-medium mb-2">Join Our Community</h3>
              <p className="text-sm text-muted-foreground">
                Share your designs and get inspired by others in our community.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

