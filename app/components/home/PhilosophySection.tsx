import { Brain, FileText, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

const philosophyCards = [
  {
    icon: <FileText className="size-5 text-primary" />,
    title: "No vocabulary required",
    body: 'Describe what it felt like. Corvivio doesn\'t care if you say "that spinny thing with the arm."',
  },
  {
    icon: <Video className="size-5 text-primary" />,
    title: "Your words, your memory",
    body: "Notes live alongside your video. Your language, your cues, your version of the pattern.",
  },
  {
    icon: <Brain className="size-5 text-primary" />,
    title: "Built for how dancers learn",
    body: "Spaced repetition was made for this. We tuned it specifically for movement recall.",
  },
]

export default function PhilosophySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mb-16 text-center">
        <p className="font-heading text-[4.5rem] font-black leading-none text-primary sm:text-[6rem] md:text-[10rem]">
          80%
        </p>
        <p className="mt-3 font-heading text-xl font-semibold text-foreground md:text-2xl">
          of what you learned is gone by Wednesday.
        </p>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
          That cross-body with the copa finish. The footwork drill your instructor showed twice.
          It dissolves unless you revisit it — deliberately, at the right moment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {philosophyCards.map(({ icon, title, body }) => (
          <Card key={title} className="bg-card/50 shadow-none">
            <CardHeader>
              <span>{icon}</span>
              <CardTitle className="font-semibold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
