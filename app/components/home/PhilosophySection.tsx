import { useEffect, useState } from "react"
import { Brain, FileText, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease-out-quart
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return count
}

const philosophyCards = [
  {
    icon: <FileText className="size-7 text-primary" />,
    title: "No vocabulary required",
    body: 'Say "that spinny thing with the arm." Corvivio takes how you describe it and turns it into a clean cue you\'ll actually recognize next time.',
  },
  {
    icon: <Video className="size-7 text-primary" />,
    title: "Your words, your memory",
    body: "Notes live alongside your video. Your language, your cues, your version of the pattern.",
  },
  {
    icon: <Brain className="size-7 text-primary" />,
    title: "Built for how dancers learn",
    body: "Spaced repetition surfaces each pattern right before it fades — so drilling feels effortless, not like catching up.",
  },
]

export default function PhilosophySection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })
  const count = useCountUp(80, 1200, inView)

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 py-12 md:py-16"
    >
      <div
        className={cn(
          "relative isolate mb-16 text-center",
          inView
            ? "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
            : "opacity-0",
        )}
      >
        {/* Warm halo behind the stat */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.553 0.195 38.402 / 0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <p className="font-heading text-[4.5rem] leading-none font-black text-primary sm:text-[6rem] md:text-[10rem]">
          {count}%
        </p>
        <p className="mt-3 font-heading text-xl font-semibold text-foreground md:text-2xl">
          of what you learned won't survive the week.
        </p>
        <div className="mx-auto mt-6 h-px w-16 bg-primary/30" />
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
          That cross-body with the copa finish. The footwork drill your
          instructor showed twice. It dissolves unless you revisit it,
          deliberately, at the right moment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {philosophyCards.map(({ icon, title, body }, i) => (
          <div
            key={title}
            className={cn(
              inView
                ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                : "opacity-0",
            )}
            style={inView ? { animationDelay: `${i * 100}ms` } : undefined}
          >
            <Card className="h-full shadow-warm-sm hover:shadow-warm-md border-l-4 border-l-primary/70 transition-shadow duration-300">
              <CardHeader className="gap-4">
                <span>{icon}</span>
                <CardTitle className="font-semibold text-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
