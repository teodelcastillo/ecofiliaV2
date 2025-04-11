import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-64" />
      </div>

      <Skeleton className="h-6 w-full max-w-md" />

      <div className="flex gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
      </div>
    </div>
  )
}
