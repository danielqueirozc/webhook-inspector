import { Skeleton } from './skeleton'

export function WebhookSkeleton() {
  return (
    <div className="p-2 w-full border border-zinc-700 rounded-md bg-zinc-800">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[60%] bg-zinc-600" />
        <Skeleton className="h-4 w-[40%] bg-zinc-600" />
        <Skeleton className="h-4 w-[80%] bg-zinc-600" />
      </div>
    </div>
  )
}

export function WebHookSkeletonList() {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <WebhookSkeleton key={index} />
      ))}
    </div>
  )
}