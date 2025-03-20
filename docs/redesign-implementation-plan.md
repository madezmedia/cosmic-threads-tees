# Cosmic Threads: Redesign Implementation Plan

This document outlines the detailed implementation plan for the Cosmic Threads website redesign based on the comprehensive strategy provided. The plan is organized into phases with specific tasks and technical details.

## Phase 1: Foundation (Weeks 1-4)

### 1.1 Design System Development

#### Color System Implementation
```typescript
// styles/theme.ts
export const colors = {
  // Primary palette
  deepSpace: "#121212",
  cosmicPurple: "#8A2BE2",
  neonTeal: "#40E0D0",
  magentaGlow: "#FF00FF",
  silverChrome: "#C0C0C0",
  
  // Functional colors
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: "hsl(var(--primary))",
  primaryForeground: "hsl(var(--primary-foreground))",
  secondary: "hsl(var(--secondary))",
  secondaryForeground: "hsl(var(--secondary-foreground))",
  accent: "hsl(var(--accent))",
  accentForeground: "hsl(var(--accent-foreground))",
}
```

```css
/* globals.css */
:root {
  --background: 0 0% 7%; /* deepSpace */
  --foreground: 0 0% 98%;
  --primary: 275 84% 53%; /* cosmicPurple */
  --primary-foreground: 0 0% 98%;
  --secondary: 174 72% 56%; /* neonTeal */
  --secondary-foreground: 0 0% 9%;
  --accent: 300 100% 50%; /* magentaGlow */
  --accent-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;
  --card: 0 0% 9%;
  --card-foreground: 0 0% 98%;
  --border: 0 0% 20%;
  --input: 0 0% 15%;
  --ring: 174 72% 56%;
}
```

#### Typography System
```typescript
// tailwind.config.ts
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      fontFamily: {
        display: ["RetroFuture", "var(--font-retro-future)", ...fontFamily.sans],
        mono: ["Space Mono", "var(--font-space-mono)", ...fontFamily.mono],
        sans: ["Inter", "var(--font-inter)", ...fontFamily.sans],
      },
    },
  },
};
```

```typescript
// app/layout.tsx
import { Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const retroFuture = localFont({
  src: "../public/fonts/RetroFuture.woff2",
  variable: "--font-retro-future",
});
```

#### Component Library Enhancement
Create a comprehensive component library based on shadcn/ui with consistent styling:

1. Update existing shadcn components with retro-futuristic styling
2. Create new custom components specific to the Cosmic Threads brand
3. Implement consistent spacing, border radius, and shadow patterns

```typescript
// components/ui/button.tsx (example of enhanced shadcn component)
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cosmic: "bg-cosmicPurple text-white border-2 border-magentaGlow/20 font-mono uppercase tracking-wider hover:bg-cosmicPurple/80",
        neon: "bg-neonTeal text-deepSpace font-mono uppercase tracking-wider hover:bg-neonTeal/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 1.2 Performance Optimization

#### Image Optimization
Implement Next.js Image component for all images:

```typescript
// components/optimized-image.tsx
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
```

#### JavaScript Optimization
Implement code splitting and lazy loading:

```typescript
// app/create/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

// Lazy load heavy components
const DesignStudio = dynamic(() => import("@/components/design-studio"), {
  loading: () => <Loader text="Loading design studio..." />,
});

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-deepSpace text-white">
      <Suspense fallback={<Loader text="Loading..." />}>
        <DesignStudio />
      </Suspense>
    </div>
  );
}
```

#### API Optimization
Implement caching for API responses:

```typescript
// lib/api-cache.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get from cache first
  const cached = await redis.get<T>(key);
  
  if (cached) {
    return cached;
  }
  
  // If not in cache, fetch and store
  const data = await fetcher();
  await redis.set(key, data, { ex: ttl });
  
  return data;
}
```

### 1.3 Mobile Responsiveness

Implement a mobile-first approach for all components:

```typescript
// components/design-studio.tsx
export default function DesignStudio() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        {/* Left panel (full width on mobile, 8/12 on large screens) */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          {/* Design controls */}
        </div>

        {/* Right panel (full width on mobile, 4/12 on large screens) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          {/* Design preview */}
        </div>
      </div>
    </div>
  );
}
```

Create a custom hook for responsive design:

```typescript
// hooks/use-media-query.ts
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Usage example
export function useMobile() {
  return useMediaQuery("(max-width: 768px)");
}
```

## Phase 2: Core Experience (Weeks 5-8)

### 2.1 New Design Workflow Implementation

#### Streamlined 3-Step Process

1. **Concept Component**:
```typescript
// components/concept-step.tsx
import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { PromptEditor } from "@/components/prompt-editor";
import { StyleSelector } from "@/components/style-selector";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function ConceptStep() {
  const { state, dispatch } = useDesign();
  const [showRealTimePreview, setShowRealTimePreview] = useState(false);
  
  // Toggle AI enhancement
  const toggleAIEnhancement = () => {
    // Implementation
  };
  
  // Generate design with real-time preview
  const generatePreview = () => {
    // Implementation for quick thumbnail generation
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <h2 className="text-2xl font-display font-bold mb-4">1. Concept</h2>
        
        {/* Prompt editor with AI enhancement toggle */}
        <PromptEditor 
          onEnhanceToggle={toggleAIEnhancement}
          showRealTimePreview={showRealTimePreview}
        />
        
        {/* Style selection with thumbnails */}
        <StyleSelector 
          onStyleChange={(style) => {
            dispatch({ type: "TOGGLE_STYLE", payload: style });
            if (showRealTimePreview) generatePreview();
          }}
        />
        
        {/* One-click generation */}
        <Button 
          variant="cosmic" 
          className="w-full mt-4"
          onClick={() => {/* Full generation implementation */}}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Design
        </Button>
      </div>
    </div>
  );
}
```

2. **Customize Component**:
```typescript
// components/customize-step.tsx
import { useDesign } from "@/context/design-context";
import { ProductSelector } from "@/components/product-selector";
import { DesignPlacement } from "@/components/design-placement";
import { ColorSelector } from "@/components/color-selector";
import { SizeSelector } from "@/components/size-selector";

export function CustomizeStep() {
  const { state, dispatch } = useDesign();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold mb-4">2. Customize</h2>
      
      {/* Product type selection */}
      <ProductSelector 
        onProductSelect={(product) => 
          dispatch({ type: "SET_MEDIUM", payload: product })
        }
      />
      
      {/* Color and size selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorSelector />
        <SizeSelector />
      </div>
      
      {/* Design placement with intuitive controls */}
      <DesignPlacement 
        design={state.generatedDesign}
        product={state.medium}
        onPlacementChange={(placement) => 
          dispatch({ type: "SET_PLACEMENT_OPTION", payload: placement })
        }
      />
    </div>
  );
}
```

3. **Checkout Component**:
```typescript
// components/checkout-step.tsx
import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { CartSummary } from "@/components/cart-summary";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderConfirmation } from "@/components/order-confirmation";
import { ProgressIndicator } from "@/components/progress-indicator";

export function CheckoutStep() {
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart, shipping, payment, confirmation
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold mb-4">3. Checkout</h2>
      
      {/* Progress indicator */}
      <ProgressIndicator 
        steps={["Cart", "Shipping", "Payment", "Confirmation"]}
        currentStep={checkoutStep}
      />
      
      {/* Dynamic checkout content based on step */}
      {checkoutStep === "cart" && <CartSummary onNext={() => setCheckoutStep("shipping")} />}
      {checkoutStep === "shipping" && (
        <CheckoutForm 
          type="shipping" 
          onBack={() => setCheckoutStep("cart")}
          onNext={() => setCheckoutStep("payment")}
        />
      )}
      {checkoutStep === "payment" && (
        <CheckoutForm 
          type="payment" 
          onBack={() => setCheckoutStep("shipping")}
          onNext={() => setCheckoutStep("confirmation")}
        />
      )}
      {checkoutStep === "confirmation" && <OrderConfirmation />}
    </div>
  );
}
```

#### Unified Design Flow Component
```typescript
// components/design-flow.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConceptStep } from "@/components/concept-step";
import { CustomizeStep } from "@/components/customize-step";
import { CheckoutStep } from "@/components/checkout-step";
import { DesignPreview } from "@/components/design-preview";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function DesignFlow() {
  const [activeStep, setActiveStep] = useState("concept");
  
  const steps = ["concept", "customize", "checkout"];
  const currentIndex = steps.indexOf(activeStep);
  
  const goToNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left panel (8/12 on large screens) */}
      <div className="lg:col-span-8">
        <Tabs value={activeStep} onValueChange={setActiveStep}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="concept">1. Concept</TabsTrigger>
            <TabsTrigger value="customize">2. Customize</TabsTrigger>
            <TabsTrigger value="checkout">3. Checkout</TabsTrigger>
          </TabsList>
          
          <div className="relative mb-8 bg-black/20 border border-chrome/20 rounded-lg p-6">
            <TabsContent value="concept">
              <ConceptStep />
            </TabsContent>
            
            <TabsContent value="customize">
              <CustomizeStep />
            </TabsContent>
            
            <TabsContent value="checkout">
              <CheckoutStep />
            </TabsContent>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              variant="cosmic"
              onClick={goToNextStep}
              disabled={currentIndex === steps.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Tabs>
      </div>
      
      {/* Right panel (4/12 on large screens) */}
      <div className="lg:col-span-4">
        <DesignPreview />
      </div>
    </div>
  );
}
```

### 2.2 Homepage and Navigation Redesign

#### New Homepage Component
```typescript
// app/page.tsx
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturedDesigns } from "@/components/featured-designs";
import { Testimonials } from "@/components/testimonials";
import { PricingPlans } from "@/components/pricing-plans";
import { CtaSection } from "@/components/cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-deepSpace text-white">
      <HeroSection />
      <HowItWorks />
      <FeaturedDesigns />
      <Testimonials />
      <PricingPlans />
      <CtaSection />
    </main>
  );
}
```

#### Hero Section Component
```typescript
// components/hero-section.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GenerationVisualization } from "@/components/generation-visualization";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-cosmicPurple/20 to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonTeal via-silverChrome to-magentaGlow">
                AI-POWERED
              </span>
              <br />
              COSMIC DESIGNS
            </h1>
            
            <p className="text-xl text-silverChrome/80">
              Create stunning, unique t-shirts and wall art with the power of AI.
              No design skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" variant="cosmic">
                <Link href="/create">Start Creating</Link>
              </Button>
              
              <Button asChild size="lg" variant="outline">
                <Link href="/gallery">Explore Gallery</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <GenerationVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### Simplified Navigation Component
```typescript
// components/main-navigation.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MainNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: "Create", href: "/create" },
    { label: "Gallery", href: "/gallery" },
    { label: "Pricing", href: "/pricing" },
  ];
  
  return (
    <header className="bg-deepSpace/80 backdrop-blur-md border-b border-silverChrome/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonTeal to-magentaGlow">
              COSMIC THREADS
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-sm uppercase tracking-wider ${
                  pathname === item.href
                    ? "text-neonTeal"
                    : "text-silverChrome hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            
            <Button variant="cosmic" size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-silverChrome"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-deepSpace border-t border-silverChrome/10">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block font-mono text-sm uppercase tracking-wider ${
                  pathname === item.href
                    ? "text-neonTeal"
                    : "text-silverChrome hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-silverChrome/10">
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login">Login</Link>
              </Button>
              
              <Button variant="cosmic" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

### 2.3 User Dashboard Improvements

#### Dashboard Layout
```typescript
// app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deepSpace text-white">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <DashboardSidebar />
          </div>
          
          <div className="lg:col-span-9">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### My Designs Component with Filtering
```typescript
// components/my-designs.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DesignGrid } from "@/components/design-grid";
import { Search, Filter } from "lucide-react";

export function MyDesigns() {
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  
  // Fetch designs
  useEffect(() => {
    // Implementation to fetch user designs
  }, []);
  
  // Filter and sort designs
  useEffect(() => {
    let result = [...designs];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(design => 
        design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterBy !== "all") {
      result = result.filter(design => design.medium === filterBy);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });
    
    setFilteredDesigns(result);
  }, [designs, searchQuery, sortBy, filterBy]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">My Designs</h1>
      
      <Card className="bg-black/20 border border-silverChrome/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silverChrome/60" size={18} />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-silverChrome/20"
            />
          </div>
          
          <div className="md:col-span-3">
            <Select
              value={filterBy}
              onValueChange={setFilterBy}
              items={[
                { value: "all", label: "All Types" },
                { value: "tshirt", label: "T-Shirts" },
                { value: "wallart", label: "Wall Art" },
              ]}
            />
          </div>
          
          <div className="md:col-span-3">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              items={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "name-asc", label: "Name (A-Z)" },
                { value: "name-desc", label: "Name (Z-A)" },
              ]}
            />
          </div>
          
          <div className="md:col-span-1">
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </div>
      </Card>
      
      <DesignGrid designs={filteredDesigns} />
    </div>
  );
}
```

## Phase 3: Advanced Features (Weeks 9-12)

### 3.1 Enhanced AI Generation Tools

#### Multi-Variant Design Generation
```typescript
// components/multi-variant-generator.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Grid2X2, Sparkles, RefreshCw, Check } from "lucide-react";

export function MultiVariantGenerator() {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variantCount, setVariantCount] = useState(4);
  const [variationStrength, setVariationStrength] = useState(0.5);
  
  // Generate multiple variants
  const generateVariants = async () => {
    setIsGenerating(true);
    
    try {
      // Implementation for generating multiple variants
      // This would call the API with different seeds or parameters
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock variants
      const mockVariants = Array(variantCount).fill(0).map((_, i) => ({
        id: `variant-${i}`,
        imageUrl: `/placeholder.svg?text=Variant+${i+1}`,
        seed: Math.floor(Math.random() * 1000000),
      }));
      
      setVariants(mockVariants);
      setSelecte
