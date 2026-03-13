'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSpecialities } from '@/hooks/useSpecialities'
import type { Speciality } from '@/types/appointments'
import { SpecialityItem } from './SpecialityItem'

interface SpecialitySidebarProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stroke px-4 py-3">
      <div className="h-5 w-5 animate-pulse rounded bg-grays-200" />
      <div className="h-4 w-32 animate-pulse rounded bg-grays-200" />
    </div>
  )
}

export function SpecialitySidebar({ selectedId, onSelect }: SpecialitySidebarProps) {
  const { specialities, loadingState, searchQuery, setSearchQuery } = useSpecialities()

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-stroke bg-bg">
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            className={cn('input pl-9')}
            placeholder="Search by Speciality/Doctor"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            aria-label="Search specialities"
          />
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        role="list"
        aria-label="Speciality list"
        aria-busy={loadingState === 'loading'}
      >
        {loadingState === 'loading' ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : specialities.length === 0 ? (
          <p
            className="text-body-md py-4 text-center text-text-muted"
            role="status"
            aria-live="polite"
          >
            No specialities found
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {specialities.map((s: Speciality) => (
              <div key={s.id} role="listitem">
                <SpecialityItem
                  speciality={s}
                  isSelected={s.id === selectedId}
                  onClick={onSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
