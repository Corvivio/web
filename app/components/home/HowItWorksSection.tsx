import { FileText, RotateCcw, Video } from "lucide-react"
import { Separator } from "~/components/ui/separator"
import StepCard from "./StepCard"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mb-16 text-center">
        <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
          Three steps. No friction.
        </h2>
        <p className="mt-3 text-muted-foreground">
          From end of class to scheduled practice in under two minutes.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">
        <StepCard
          number="01"
          icon={<Video className="size-7" />}
          title="Record"
          description="Film your end-of-class run-through. 60 seconds is enough. Camera roll upload, no in-app recording."
        />

        <div className="hidden md:flex flex-1 items-center mt-8 px-6">
          <Separator className="bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
        </div>
        <Separator
          orientation="vertical"
          className="md:hidden h-8 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"
        />

        <StepCard
          number="02"
          icon={<FileText className="size-7" />}
          title="Describe"
          description="Write a quick note in your own words. No taxonomy, no move names. Sloppy is fine — this is for you."
        />

        <div className="hidden md:flex flex-1 items-center mt-8 px-6">
          <Separator className="bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
        </div>
        <Separator
          orientation="vertical"
          className="md:hidden h-8 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"
        />

        <StepCard
          number="03"
          icon={<RotateCcw className="size-7" />}
          title="Practice"
          description="Corvivio resurfaces the right video at the right time. You just show up and move."
        />
      </div>
    </section>
  )
}
