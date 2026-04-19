function oc(l: number, c: number, h: number, a: number) {
  return `oklch(${l} ${c} ${h} / ${a})`
}

export default function FeatureCard({
  badge,
  title,
  description,
  chips,
  accentL,
}: {
  badge: string
  title: string
  description: string
  chips: string[]
  accentL: [number, number, number]
}) {
  const [l, c, h] = accentL

  return (
    <div
      className="relative h-full overflow-hidden rounded-[2.5rem] border border-border/18 bg-card p-10 shadow-warm-sm transition-shadow duration-300 hover:shadow-warm-md"
    >
      {/* Top-right blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12"
        style={{
          width: 180,
          height: 180,
          borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%",
          background: oc(l, c, h, 0.08),
        }}
      />

      {/* Badge */}
      <span
        className="relative mb-6 inline-block rounded-full px-[0.875rem] py-[0.3rem] text-xs font-bold tracking-[0.02em]"
        style={{
          background: oc(l, c, h, 0.12),
          color: oc(l, c, h, 1),
          border: `1px solid ${oc(l, c, h, 0.22)}`,
        }}
      >
        {badge}
      </span>

      <h3 className="relative mb-[0.875rem] font-heading text-[1.6rem] font-extrabold tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="relative mb-7 text-[0.95rem] leading-[1.7] text-muted-foreground">
        {description}
      </p>

      {/* Chips */}
      <div className="relative flex flex-wrap gap-[0.45rem]">
        {chips.map((ch) => (
          <span
            key={ch}
            className="rounded-full border border-border/25 bg-muted px-[0.875rem] py-[0.3rem] text-xs font-medium text-muted-foreground"
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  )
}
