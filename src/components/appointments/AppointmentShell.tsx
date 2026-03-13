'use client'

import { useState } from 'react'
import { mockSpecialities } from '@/mocks/appointments'
import { SpecialitySidebar } from './SpecialitySidebar'
import { DoctorGrid } from './DoctorGrid'

export function AppointmentShell() {
  // Default to first speciality selected
  const [selectedId, setSelectedId] = useState<string | null>(mockSpecialities[0]?.id ?? null)

  return (
    <div className="flex h-full flex-col">
      {/* Main layout: sidebar + content */}
      <div className="flex min-h-0 flex-1">
        <SpecialitySidebar selectedId={selectedId} onSelect={setSelectedId} />

        <main id="doctor-listing" className="bg-grays-50 flex-1 overflow-y-auto">
          <DoctorGrid selectedSpecialityId={selectedId} />
        </main>
      </div>
    </div>
  )
}
