import { Wave } from "./Wave"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"
import FeatureCard from "./FeatureCard"

const BG = "oklch(0.985 0.008 70)"
const BG_WARM = "oklch(0.975 0.014 55)"

const features = [
  {
    badge: "Video Log",
    title: "Capture the moment",
    description:
      "Upload your end-of-class video. Corvivio suggests a title and surfaces key things to focus on. Then you accept, edit, or ignore.",
    chips: [
      "AI title suggestion",
      "Personal notes",
      "Structured practice tips",
    ],
    accentL: [0.553, 0.195, 38.402] as [number, number, number],
  },
  {
    badge: "Practice Queue",
    title: "SM-2 Spaced Repetition",
    description:
      "The same algorithm behind Anki, adapted for video review. Each video gets its own card, scheduled based on how well you recalled it.",
    chips: [
      "Per-video scheduling",
      "Again / Got it / Easy",
      "Adaptive intervals",
    ],
    accentL: [0.455, 0.138, 82] as [number, number, number],
  },
]

export default function FeaturesSection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <div style={{ background: BG_WARM }}>
      <Wave fill={BG} invert />
      <section
        id="features"
        ref={sectionRef}
        className="mx-auto max-w-6xl px-6 py-20"
      >
        <div
          className={cn(
            "mb-14 text-center transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          )}
        >
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">
            What's in V0.1
          </h2>
          <p className="mt-[0.625rem] text-[1.05rem] text-muted-foreground">
            Two focused tools. Nothing you don't need yet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={cn(
                "h-full transition-all duration-700",
                inView ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
              )}
              style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
            >
              <FeatureCard {...feat} />
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-6 rounded-[1.5rem] border border-dashed border-border/45 px-7 py-[1.125rem] text-center text-[0.875rem] text-muted-foreground transition-all duration-700",
            inView ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: inView ? "350ms" : "0ms" }}
        >
          <span className="font-semibold text-foreground">Coming in V1:</span>
          {"  "}clip tagging · AI position extraction · move library ·
          urgency-based queue
        </div>
      </section>
      <Wave fill={BG} flip />
    </div>
  )
}
