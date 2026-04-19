const STEP_ACCENTS: [number, number, number][] = [
  [0.553, 0.195, 38.402],
  [0.5, 0.16, 55],
  [0.455, 0.138, 82],
]

function oc(l: number, c: number, h: number, a: number) {
  return `oklch(${l} ${c} ${h} / ${a})`
}

export default function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  const idx = parseInt(number, 10) - 1
  const [l, c, h] = STEP_ACCENTS[idx] ?? STEP_ACCENTS[0]

  return (
    <div className="shadow-warm-sm relative overflow-hidden rounded-[2.25rem] border border-border/20 bg-card p-9 md:w-72">
      {/* Top-right blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 -right-8"
        style={{
          width: 110,
          height: 110,
          borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%",
          background: oc(l, c, h, 0.09),
        }}
      />

      {/* Step number */}
      <span
        aria-hidden="true"
        className="mb-5 block font-heading leading-none font-black select-none"
        style={{
          fontSize: "3.75rem",
          letterSpacing: "-0.05em",
          color: oc(0.553, 0.195, 38.402, 0.16),
        }}
      >
        {number}
      </span>

      <h3 className="mb-3 font-heading text-2xl font-extrabold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-[0.95rem] leading-[1.7] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
