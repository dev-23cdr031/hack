import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-64 mx-auto mb-8" />
      
      <div className="max-w-md mx-auto">
        <Skeleton className="h-8 w-full mb-6" />
        
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}