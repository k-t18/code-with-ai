'use client'

import { Fragment, useState } from 'react'
import { useDoctors } from '@/hooks/useDoctors'
import { DoctorCard } from './DoctorCard'
import { DoctorCardSkeleton } from './DoctorCardSkeleton'
import { EmptyDoctorState } from './EmptyDoctorState'
import { ScheduleCalendar } from './ScheduleCalendar'

interface DoctorGridProps {
  selectedSpecialityId: string | null
}

const SKELETON_COUNT = 6
const GRID_COLS = 3 // matches xl:grid-cols-3

export function DoctorGrid({ selectedSpecialityId }: DoctorGridProps) {
  const { doctors, loadingState } = useDoctors(selectedSpecialityId)

  // Store selection as { specialityId, doctorId } so it auto-clears when speciality changes
  const [selection, setSelection] = useState<{ specialityId: string; doctorId: string } | null>(
    null,
  )
  const selectedDoctorId =
    selection?.specialityId === selectedSpecialityId ? selection.doctorId : null

  const handleBookNow = (doctorId: string) => {
    if (!selectedSpecialityId) return
    setSelection((prev) =>
      prev?.doctorId === doctorId && prev.specialityId === selectedSpecialityId
        ? null
        : { specialityId: selectedSpecialityId, doctorId },
    )
  }

  if (!selectedSpecialityId) {
    return <EmptyDoctorState variant="no-selection" />
  }

  if (loadingState === 'loading') {
    return (
      <div
        className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Loading doctors"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (loadingState === 'success' && doctors.length === 0) {
    return <EmptyDoctorState variant="no-doctors" />
  }

  // Index of the last card in the same row as the selected doctor (3-col layout)
  const selectedIdx = selectedDoctorId
    ? doctors.findIndex((d) => d.id === selectedDoctorId)
    : -1
  const rowEndIdx =
    selectedIdx >= 0
      ? Math.min(Math.ceil((selectedIdx + 1) / GRID_COLS) * GRID_COLS - 1, doctors.length - 1)
      : -1

  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor, index) => (
        <Fragment key={doctor.id}>
          <DoctorCard
            doctor={doctor}
            isSelected={selectedDoctorId === doctor.id}
            isMuted={selectedDoctorId !== null && selectedDoctorId !== doctor.id}
            onBookNow={handleBookNow}
          />
          {index === rowEndIdx && selectedDoctorId && (
            <div className="col-span-full">
              <ScheduleCalendar doctorId={selectedDoctorId} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}
