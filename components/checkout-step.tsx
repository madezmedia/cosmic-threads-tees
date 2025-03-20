'use client';

import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CreditCard, Truck, Check, ShieldCheck } from "lucide-react";

export function CheckoutStep() {
  const { state } = useDesign();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    paymentMethod: "credit-card",
    saveInfo: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveInfo: checked }));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to order complete page
      window.location.href = "/order-complete";
    } catch (error) {
      console.error("Error submitting order:", error);
      setIsSubmitting(false);
      alert("Failed to submit order. Please try again.");
    }
  };
  
  // Calculate price based on medium
  const getPrice = () => {
    switch (state.medium?.id) {
      case "tshirt":
        return 29.99;
      case "wallart":
        return 49.99;
      case "hoodie":
        return 59.99;
      case "mug":
        return 19.99;
      default:
        return 0;
    }
  };
  
  const price = getPrice();
  const shipping = 4.99;
  const tax = price * 0.08;
  const total = price + shipping + tax;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display tracking-tight">Complete Your Order</h2>
      <p className="text-muted-foreground">
        Review your design and enter your shipping and payment information.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Order summary */}
        <div className="space-y-6">
          <h3 className="text-xl font-display">Order Summary</h3>
          
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex justify-between items-center py-2 border-b border-silverChrome/20">
                <span className="font-mono uppercase">{state.medium?.name || "Product"}</span>
                <span className="font-mono">${price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-silverChrome/20">
                <span className="font-mono uppercase">Shipping</span>
                <span className="font-mono">${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-silverChrome/20">
                <span className="font-mono uppercase">Tax</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 mt-2">
                <span className="font-mono uppercase font-bold">Total</span>
                <span className="font-mono font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Estimated delivery: 5-7 business days</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure checkout with 256-bit encryption</span>
            </div>
          </div>
        </div>
        
        {/* Right column - Checkout form */}
        <div className="space-y-6">
          <h3 className="text-xl font-display">Shipping Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-silverChrome/30 bg-deepSpace/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-silverChrome/30 bg-deepSpace/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="border-silverChrome/30 bg-deepSpace/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="border-silverChrome/30 bg-deepSpace/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="border-silverChrome/30 bg-deepSpace/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="border-silverChrome/30 bg-deepSpace/50"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-display">Payment Method</h3>
              
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
              
              {formData.paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      className="border-silverChrome/30 bg-deepSpace/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="border-silverChrome/30 bg-deepSpace/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        className="border-silverChrome/30 bg-deepSpace/50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="save-info"
                checked={formData.saveInfo}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="save-info" className="text-sm">
                Save my information for faster checkout next time
              </Label>
            </div>
            
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Order
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
