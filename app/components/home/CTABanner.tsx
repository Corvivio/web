import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export default function CTABanner() {
  return (
    <section className="mx-4 my-16 md:mx-auto md:max-w-4xl">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 80% at 50% 120%,
              oklch(0.553 0.195 38.402 / 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 100% 100% at 50% 50%,
              oklch(1 0 0) 0%, oklch(1 0 0) 100%)
          `,
        }}
      >
        <div className="relative flex flex-col items-center gap-6 px-6 py-20 text-center">
          <Badge
            variant="outline"
            className="h-auto border-primary/40 bg-primary/10 px-3 py-1 text-primary"
          >
            Free while we're in beta
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl max-w-lg">
            Start capturing your practice.
          </h2>
          <p className="text-muted-foreground max-w-sm">
            No dance vocabulary required. No setup beyond uploading a video.
            Just the loop that helps you actually retain what you learn.
          </p>
          <Button size="lg" asChild className="px-10 text-base">
            <Link to="/signup">Join the Beta →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
