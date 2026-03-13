export function DoctorCardSkeleton() {
  return (
    <div className="card flex flex-col gap-4" aria-hidden="true">
      {/* Photo + info row */}
      <div className="flex gap-3">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-grays-200" />
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="h-4 w-36 animate-pulse rounded bg-grays-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-grays-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-grays-200" />
        </div>
      </div>
      {/* Actions row */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-md bg-grays-200" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-grays-200" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-grays-200" />
        <div className="ml-auto h-8 w-28 animate-pulse rounded-md bg-grays-200" />
      </div>
    </div>
  )
}
