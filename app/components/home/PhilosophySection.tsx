import { Brain, FileText, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

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
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="relative isolate mb-16 text-center">
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
          80%
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
        {philosophyCards.map(({ icon, title, body }) => (
          <Card
            key={title}
            className="shadow-warm-sm hover:shadow-warm-md border-l-4 border-l-primary/70 transition-shadow duration-300"
          >
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
        ))}
      </div>
    </section>
  )
}
