import { Video, Zap } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import FeatureCard from "./FeatureCard"

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-12 text-center">
        <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
          What's in V0.1
        </h2>
        <p className="mt-3 text-muted-foreground">
          Two focused tools. Nothing you don't need yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FeatureCard
          badge="Video Log"
          icon={<Video className="size-5" />}
          title="Capture the moment"
          description="Upload your end-of-class video and write what you remember. Corvivio suggests a title and surfaces the key things to focus on — you accept, edit, or ignore."
          detail="AI title suggestion · Personal notes · Structured practice tips"
        />
        <FeatureCard
          badge="Practice Queue"
          icon={<Zap className="size-5" />}
          title="SM-2 Spaced Repetition"
          description="The same algorithm behind Anki, adapted for video review. Each video gets its own card scheduled individually based on how well you recalled it."
          detail="Per-video scheduling · again / got it / easy rating · Adaptive intervals"
        />
      </div>

      <Card className="mt-6 bg-card/30 shadow-none ring-border/50 text-center">
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Coming in V1:</span> clip tagging, AI position extraction, move library, and a practice queue that surfaces patterns by urgency.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
