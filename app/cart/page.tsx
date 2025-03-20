"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Trash2, ArrowLeft, ShoppingBag, ChevronUp, ChevronDown, AlertCircle } from "lucide-react"
import { useApp } from "@/context/app-context"
import AppLayout from "@/components/app-layout"
import { orderApi } from "@/lib/api-service"

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, cartTotal, isAuthenticated } = useApp()
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()

  // Calculate shipping cost - could be more complex in a real app
  const shippingCost = cart.length > 0 ? 9.99 : 0

  // Calculate tax - simplified for demo
  const taxRate = 0.0825 // 8.25%
  const taxAmount = (cartTotal + shippingCost - discount) * taxRate

  // Calculate final total
  const finalTotal = cartTotal + shippingCost + taxAmount - discount

  const applyPromoCode = () => {
    // Simple promo code logic - in a real app this would validate against a database
    if (promoCode.toLowerCase() === "first10") {
      const newDiscount = cartTotal * 0.1 // 10% discount
      setDiscount(newDiscount)
      setPromoCode("")
    }
  }

  const handleQuantityChange = (itemId: string, change: number, currentQuantity: number) => {
    updateCartItem(itemId, currentQuantity + change)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=cart")
      return
    }

    if (cart.length === 0) return

    setIsProcessing(true)
    try {
      // Create order from cart
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {}, // This would be filled in on the checkout page
        total: finalTotal,
        subtotal: cartTotal,
        tax: taxAmount,
        shipping: shippingCost,
        discount,
      }

      const { data, error } = await orderApi.createOrder(orderData)

      if (error) throw new Error(error)

      // Clear cart and redirect to checkout
      clearCart()
      router.push(`/checkout/${data.order.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

        {cart.length === 0 ? (
          <Card className="bg-black/30 border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-white/40" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Your cart is empty</h3>
              <p className="text-white/60 mb-6">Add some amazing designs to get started!</p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                asChild
              >
                <Link href="/create">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-black/30 border-white/10">
                <CardHeader className="border-b border-white/10">
                  <CardTitle>
                    Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b border-white/10 p-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-24 w-24 bg-black/50 rounded overflow-hidden">
                          <img
                            src={item.design.content || "/placeholder.svg?text=No+Preview"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-medium text-white">{item.product.name}</h3>
                          <p className="text-sm text-white/60">
                            {item.product.variants.find((v) => v.id === item.variantId)?.name || "Standard"}
                          </p>
                          <p className="text-sm text-white/60 line-clamp-1 mt-1">
                            Design: {item.design.prompt.substring(0, 50)}
                            {item.design.prompt.length > 50 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <span className="text-white font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                              disabled={item.quantity <= 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-white/60">${item.price.toFixed(2)} each</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-red-400 hover:bg-white/10"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                    <Link href="/create">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-black/30 border-white/10 sticky top-24">
                <CardHeader className="border-b border-white/10">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-white/70">Tax (8.25%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-black/50 border-white/20 text-white"
                      />
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={applyPromoCode}
                        disabled={!promoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-white/60 mt-2">Try "FIRST10" for 10% off your first order</p>
                  </div>

                  {!isAuthenticated && (
                    <div className="bg-white/5 p-3 rounded-lg flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-white">Login Required</p>
                        <p className="text-xs text-white/60 mt-1">
                          Please{" "}
                          <Link href="/login?redirect=cart" className="text-purple-400 hover:underline">
                            login
                          </Link>{" "}
                          to complete your purchase.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full py-6"
                    onClick={handleCheckout}
                    disabled={isProcessing || cart.length === 0}
                  >
                    {isProcessing ? "Processing..." : isAuthenticated ? "Proceed to Checkout" : "Login & Checkout"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
