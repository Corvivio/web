import { Fragment } from "react"
import { FileText, RotateCcw, Video } from "lucide-react"
import { Separator } from "~/components/ui/separator"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"
import StepCard from "./StepCard"

export default function HowItWorksSection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  const steps = [
    {
      number: "01",
      icon: <Video className="size-7" />,
      title: "Record",
      description:
        "Film your end-of-class run-through. 60 seconds is enough. Camera roll upload, no in-app recording.",
    },
    {
      number: "02",
      icon: <FileText className="size-7" />,
      title: "Describe",
      description:
        "Write a quick note in your own words. No taxonomy, no move names. Sloppy is fine, this is for you.",
    },
    {
      number: "03",
      icon: <RotateCcw className="size-7" />,
      title: "Practice",
      description:
        "Corvivio resurfaces the right video at the right time. You just show up and move.",
    },
  ]

  return (
    <div className="bg-primary/[0.03] rounded-3xl mx-4 md:mx-auto md:max-w-7xl">
      <section
        id="how-it-works"
        ref={sectionRef}
        className="mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        <div
          className={cn(
            "mb-16 text-center",
            inView
              ? "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
              : "opacity-0",
          )}
        >
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Three steps. No friction.
          </h2>
          <p className="mt-3 text-muted-foreground">
            From end of class to scheduled practice in under two minutes.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <div
                className={cn(
                  "shrink-0",
                  inView
                    ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                    : "opacity-0",
                )}
                style={inView ? { animationDelay: `${i * 150}ms` } : undefined}
              >
                <StepCard {...step} />
              </div>

              {i < steps.length - 1 && (
                <>
                  <div className="hidden md:flex flex-1 items-center mt-8 px-6">
                    <Separator className="bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  </div>
                  <Separator
                    orientation="vertical"
                    className="md:hidden h-8 bg-gradient-to-b from-transparent via-primary/60 to-transparent"
                  />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  )
}
