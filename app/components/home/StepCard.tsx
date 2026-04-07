import type { ReactNode } from "react"

export default function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative flex flex-col items-center text-center gap-4 md:w-56 shrink-0 pt-8">
      {/* Decorative watermark step number */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 font-heading font-black text-[6rem] leading-none text-primary/[0.07] select-none pointer-events-none"
      >
        {number}
      </span>

      {/* Icon box — warm amber glow */}
      <div className="relative flex items-center justify-center size-20 rounded-2xl bg-primary/15 border border-primary/30 text-primary shadow-warm-sm hover:bg-primary/20 transition-colors duration-200">
        {icon}
      </div>

      <h3 className="font-heading font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">{description}</p>
    </div>
  )
}
