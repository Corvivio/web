import { Fragment } from "react"
import { Wave } from "./Wave"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"
import StepCard from "./StepCard"

const BG = "oklch(0.985 0.008 70)"
const BG_WARM = "oklch(0.975 0.014 55)"

export default function HowItWorksSection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  const steps = [
    {
      number: "01",
      title: "Record",
      description:
        "Film your end-of-class run-through. 60 seconds is enough: just your camera roll, no in-app recording.",
    },
    {
      number: "02",
      title: "Describe",
      description:
        "Write what you remember in your own words. No taxonomy, no combo names. Sloppy is fine, this is for you.",
    },
    {
      number: "03",
      title: "Practice",
      description:
        "Corvivio resurfaces the right video at the right moment. You just show up and dance!",
    },
  ]

  return (
    <div style={{ background: BG_WARM }}>
      <Wave fill={BG} invert />
      <section
        id="how-it-works"
        ref={sectionRef}
        className="mx-auto max-w-6xl px-6 py-20"
      >
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">
            Three steps. No friction.
          </h2>
          <p className="mt-3 text-[1.05rem] text-muted-foreground">
            From end of class to scheduled practice in under two minutes
            minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={cn(
                "transition-all duration-700",
                inView ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
              )}
              style={{ transitionDelay: inView ? `${i * 110}ms` : "0ms" }}
            >
              <StepCard {...step} />
            </div>
          ))}
        </div>
      </section>
      <Wave fill={BG} flip />
    </div>
  )
}
