import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryLoading() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[250px] w-full rounded-lg" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

