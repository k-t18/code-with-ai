const LEGEND_ITEMS = [
  { label: 'Available', swatch: 'bg-bg border border-stroke' },
  { label: 'Selected', swatch: 'bg-brand-600 border border-brand-600' },
  { label: 'Blocked', swatch: 'bg-danger-100 border border-danger-200' },
  { label: 'Leave', swatch: 'bg-other-100 border border-other-200' },
  { label: 'Holiday', swatch: 'bg-warning-100 border border-warning-200' },
  { label: 'Booked', swatch: 'bg-grays-200 border border-grays-300' },
] as const

export function SlotLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {LEGEND_ITEMS.map(({ label, swatch }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`h-4 w-4 rounded ${swatch}`} />
          <span className="text-body-sm text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  )
}
