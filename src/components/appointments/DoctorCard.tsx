import Image from 'next/image'
import { Calendar, Mail, MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toProxyUrl } from '@/lib/image-proxy'
import type { Doctor } from '@/types/appointments'

interface DoctorCardProps {
  doctor: Doctor
  isSelected?: boolean
  isMuted?: boolean
  onBookNow: (doctorId: string) => void
}

interface IconButtonProps {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  label: string
  href: string
}

function ContactIconButton({ icon: Icon, label, href }: IconButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md border border-stroke text-text-muted transition-colors',
        'hover:border-brand-500 hover:text-brand-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}

export function DoctorCard({ doctor, isSelected, isMuted, onBookNow }: DoctorCardProps) {
  return (
    <article
      className={cn(
        'card flex flex-col gap-4 transition-all duration-200',
        isSelected && 'border-brand-600 bg-brand-50 ring-1 ring-brand-600',
        isMuted && 'opacity-50',
      )}
    >
      {/* Doctor info */}
      <div className="flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-grays-100">
          <Image
            src={toProxyUrl(doctor.photo)}
            alt={`Photo of ${doctor.name}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col justify-center gap-0.5">
          <p className="text-h5 text-heading">{doctor.name}</p>
          <p className="text-body-md text-text-muted">{doctor.speciality}</p>
          <p className="text-body-md text-text-muted">Exp: {doctor.experienceYears} years</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ContactIconButton
          icon={Mail}
          label={`Email ${doctor.name}`}
          href={`mailto:${doctor.email}`}
        />
        <ContactIconButton
          icon={Phone}
          label={`Call ${doctor.name}`}
          href={`tel:${doctor.phone}`}
        />
        <ContactIconButton
          icon={MessageCircle}
          label={`WhatsApp ${doctor.name}`}
          href={`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}`}
        />

        <button
          type="button"
          onClick={() => onBookNow(doctor.id)}
          className={cn(
            'btn-primary btn-md ml-auto flex items-center gap-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Book Now
        </button>
      </div>
    </article>
  )
}
