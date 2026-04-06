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
    <div className="flex flex-col items-center text-center gap-4 md:w-56 shrink-0">
      <div className="relative flex items-center justify-center size-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
        {icon}
        <span className="absolute -top-2 -right-2 text-[10px] font-bold font-heading text-primary/60 bg-background px-1 rounded">
          {number}
        </span>
      </div>
      <h3 className="font-heading font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">{description}</p>
    </div>
  )
}
