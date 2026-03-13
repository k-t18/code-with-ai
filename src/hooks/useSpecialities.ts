'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { mockSpecialities } from '@/mocks/appointments'
import type { Speciality } from '@/types/appointments'

type LoadingState = 'loading' | 'success'

interface UseSpecialitiesReturn {
  specialities: Speciality[]
  loadingState: LoadingState
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function useSpecialities(): UseSpecialitiesReturn {
  const [loadingState, setLoadingState] = useState<LoadingState>('loading')
  const [allSpecialities, setAllSpecialities] = useState<Speciality[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Simulate async data fetch — setState only inside async callback, never synchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllSpecialities(mockSpecialities)
      setLoadingState('success')
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Debounce the search query by 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const specialities = useMemo(() => {
    if (!debouncedQuery.trim()) return allSpecialities
    const lower = debouncedQuery.toLowerCase()
    return allSpecialities.filter((s) => s.name.toLowerCase().includes(lower))
  }, [allSpecialities, debouncedQuery])

  return { specialities, loadingState, searchQuery, setSearchQuery }
}
