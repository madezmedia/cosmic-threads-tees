"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Image, History, Settings, Palette } from "lucide-react"
import { useApp } from "@/context/app-context"
import AppLayout from "@/components/app-layout"
import { designApi, orderApi } from "@/lib/api-service"
import type { Design } from "@/lib/types"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useApp()
  const [userDesigns, setUserDesigns] = useState<Design[]>([])
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Load user data
    async function loadUserData() {
      if (!isAuthenticated) return

      setIsLoadingData(true)
      try {
        // Load designs
        const { data: designs, error: designsError } = await designApi.getUserDesigns()
        if (!designsError && designs) {
          setUserDesigns(designs)
        }

        // Load orders
        const { data: orders, error: ordersError } = await orderApi.getUserOrders()
        if (!ordersError && orders) {
          setUserOrders(orders)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-lg text-white/70">Loading...</div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-white/70">Welcome back, {user?.full_name || user?.email?.split("@")[0] || "Artist"}!</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
              asChild
            >
              <Link href="/create">
                <Palette className="mr-2 h-4 w-4" />
                New Design
              </Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
              <Link href="/orders">
                <History className="mr-2 h-4 w-4" />
                Order History
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="designs" className="space-y-6">
          <TabsList className="bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
            <TabsTrigger
              value="designs"
              className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              My Designs
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              Recent Orders
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designs">
            {isLoadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="bg-black/30 border-white/10">
                    <div className="aspect-[4/3] bg-black/50 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-5 bg-white/10 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userDesigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDesigns.map((design) => (
                  <Card key={design.id} className="bg-black/30 border-white/10 overflow-hidden">
                    <div className="aspect-[4/3] bg-black/50 relative group">
                      <img
                        src={design.content || "/placeholder.svg?text=No+Preview"}
                        alt={`Design ${design.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-white text-black hover:bg-white/90" asChild>
                            <Link href={`/create/${design.id}`}>Edit</Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/40 text-white hover:bg-white/10"
                            asChild
                          >
                            <Link href={`/try-on?design=${design.id}`}>Try On</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-white mb-1">Design {design.id}</h3>
                      <p className="text-sm text-white/60 line-clamp-1">{design.prompt}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Create new design card */}
                <Card className="bg-black/30 border-white/10 border-dashed h-full min-h-[240px]">
                  <CardContent className="p-0 h-full">
                    <Link href="/create" className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="font-medium text-white mb-2">Create New Design</h3>
                      <p className="text-sm text-white/60">Generate a new AI artwork</p>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Image className="h-8 w-8 text-white/40" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No designs yet</h3>
                  <p className="text-white/60 mb-6">Create your first AI-generated artwork</p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                    asChild
                  >
                    <Link href="/create">
                      <Palette className="mr-2 h-4 w-4" />
                      Start Designing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {isLoadingData ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-black/30 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="h-20 w-20 bg-white/10 rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-white/10 rounded animate-pulse w-1/3" />
                          <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                          <div className="h-4 bg-white/10 rounded animate-pulse w-1/4" />
                        </div>
                        <div className="h-8 bg-white/10 rounded animate-pulse w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card key={order.id} className="bg-black/30 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-20 w-20 bg-black/50 rounded overflow-hidden">
                          <img
                            src={order.designs?.image_url || "/placeholder.svg?text=No+Preview"}
                            alt={order.designs?.name || "Order"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-white/60">{new Date(order.created_at).toLocaleDateString()}</p>
                          <p
                            className={`text-sm mt-1 ${
                              order.status === "completed"
                                ? "text-green-400"
                                : order.status === "cancelled"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-white">${order.amount.toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 border-white/20 text-white hover:bg-white/10"
                            asChild
                          >
                            <Link href={`/orders/${order.id}`}>Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <History className="h-8 w-8 text-white/40" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
                  <p className="text-white/60 mb-6">Your order history will appear here</p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                    asChild
                  >
                    <Link href="/create">
                      <Palette className="mr-2 h-4 w-4" />
                      Create and Order
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">Email</h3>
                    <p className="text-white">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">Name</h3>
                    <p className="text-white">{user?.full_name || "Not set"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
