import { useEffect, useState } from "react"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return count
}

const philosophyCards = [
  {
    title: "No vocabulary required",
    body: 'Say "that spinny thing with the arm." Corvivio takes how you describe it and turns it into a cue you\'ll actually recognise next time.',
  },
  {
    title: "Your words, your memory",
    body: "Notes live alongside your video. Your language, your cues, your version of the pattern.",
  },
  {
    title: "Built for how dancers learn",
    body: "Spaced repetition surfaces each pattern right before it fades. So drilling feels effortless, not like catching up.",
  },
]

export default function PhilosophySection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })
  const count = useCountUp(80, 1400, inView)

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-6 py-28">
      {/* Stat block */}
      <div
        className={cn(
          "relative isolate mb-20 text-center transition-all duration-700",
          inView ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.553 0.195 38.402 / 0.18) 0%, transparent 70%)",
          }}
        />
        <p
          className="font-heading leading-none font-black text-primary"
          style={{
            fontSize: "clamp(5.5rem,20vw,12rem)",
            letterSpacing: "-0.05em",
          }}
        >
          {count}%
        </p>
        <p
          className="mt-2 font-heading font-bold text-foreground"
          style={{
            fontSize: "clamp(1.1rem,2.5vw,1.6rem)",
            letterSpacing: "-0.01em",
          }}
        >
          of what you learned won't survive the week.
        </p>
        <div className="mx-auto mt-7 h-[3px] w-10 rounded-full bg-primary" />
        <p className="mx-auto mt-7 max-w-[520px] leading-[1.75] text-muted-foreground">
          That cross-body with the copa finish. The footwork drill your
          instructor showed twice. It dissolves unless you revisit it,
          deliberately, at the right moment.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {philosophyCards.map(({ title, body }, i) => (
          <div
            key={title}
            className={cn(
              "shadow-warm-sm relative overflow-hidden rounded-[2rem] border border-border/18 bg-card p-8 transition-all duration-700",
              inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
            style={{ transitionDelay: inView ? `${350 + i * 100}ms` : "0ms" }}
          >
            <h3 className="mb-[0.625rem] font-heading text-[1.1rem] font-extrabold tracking-[-0.01em] text-foreground">
              {title}
            </h3>
            <p className="text-[0.9rem] leading-[1.7] text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
