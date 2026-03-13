import { CalendarX2, Stethoscope } from 'lucide-react'

interface EmptyDoctorStateProps {
  variant: 'no-selection' | 'no-doctors'
}

export function EmptyDoctorState({ variant }: EmptyDoctorStateProps) {
  const isNoSelection = variant === 'no-selection'

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
      <div className="rounded-full bg-brand-50 p-4">
        {isNoSelection ? (
          <Stethoscope className="h-8 w-8 text-brand-500" aria-hidden="true" />
        ) : (
          <CalendarX2 className="h-8 w-8 text-brand-500" aria-hidden="true" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-h5 text-heading">
          {isNoSelection ? 'Select a Speciality' : 'No Doctors Available'}
        </p>
        <p className="text-body-md text-text-muted">
          {isNoSelection
            ? 'Please select a speciality to view doctors'
            : 'No doctors available for this speciality'}
        </p>
      </div>
    </div>
  )
}
