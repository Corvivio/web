import { Video, Zap } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"
import FeatureCard from "./FeatureCard"

export default function FeaturesSection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section
      id="features"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 py-12 md:py-16"
    >
      <div
        className={cn(
          "mb-12 text-center",
          inView
            ? "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
            : "opacity-0",
        )}
      >
        <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
          What's in V0.1
        </h2>
        <p className="mt-3 text-muted-foreground">
          Two focused tools. Nothing you don't need yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          className={cn(
            "h-full",
            inView
              ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              : "opacity-0",
          )}
          style={inView ? { animationDelay: "100ms" } : undefined}
        >
          <FeatureCard
            badge="Video Log"
            icon={<Video className="size-5" />}
            title="Capture the moment"
            description="Upload your end-of-class video and write what you remember. Corvivio suggests a title and surfaces the key things to focus on — you accept, edit, or ignore."
            detail="AI title suggestion · Personal notes · Structured practice tips"
          />
        </div>
        <div
          className={cn(
            "h-full",
            inView
              ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              : "opacity-0",
          )}
          style={inView ? { animationDelay: "200ms" } : undefined}
        >
          <FeatureCard
            badge="Practice Queue"
            icon={<Zap className="size-5" />}
            title="SM-2 Spaced Repetition"
            description="The same algorithm behind Anki, adapted for video review. Each video gets its own card scheduled individually based on how well you recalled it."
            detail="Per-video scheduling · again / got it / easy rating · Adaptive intervals"
          />
        </div>
      </div>

      <Card
        className={cn(
          "mt-6 bg-card/30 shadow-none ring-border/50 text-center",
          inView
            ? "animate-in fade-in duration-700 fill-mode-both"
            : "opacity-0",
        )}
        style={inView ? { animationDelay: "300ms" } : undefined}
      >
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Coming in V1:</span>{" "}
            clip tagging, AI position extraction, move library, and a practice
            queue that surfaces patterns by urgency.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
