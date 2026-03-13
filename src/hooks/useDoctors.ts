'use client'

import { useEffect, useState } from 'react'
import { mockDoctors, mockSpecialities } from '@/mocks/appointments'
import type { Doctor } from '@/types/appointments'

type LoadingState = 'idle' | 'loading' | 'success'

interface DoctorsState {
  resolvedForId: string | null
  doctors: Doctor[]
}

interface UseDoctorsReturn {
  doctors: Doctor[]
  loadingState: LoadingState
}

export function useDoctors(specialityId: string | null): UseDoctorsReturn {
  const [state, setState] = useState<DoctorsState>({ resolvedForId: null, doctors: [] })

  // Derive loading state — no synchronous setState in effect body
  const loadingState: LoadingState = !specialityId
    ? 'idle'
    : state.resolvedForId !== specialityId
      ? 'loading'
      : 'success'

  useEffect(() => {
    if (!specialityId) return

    const speciality = mockSpecialities.find((s) => s.id === specialityId)
    const timer = setTimeout(() => {
      const filtered = speciality
        ? mockDoctors.filter((d) => d.speciality === speciality.name)
        : []
      setState({ resolvedForId: specialityId, doctors: filtered })
    }, 500)

    return () => clearTimeout(timer)
  }, [specialityId])

  return { doctors: state.doctors, loadingState }
}
