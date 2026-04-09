import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { useInView } from "~/hooks/useInView"
import { cn } from "~/lib/utils"

export default function CTABanner() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="mx-4 my-16 md:mx-auto md:max-w-4xl"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          inView
            ? "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
            : "opacity-0",
        )}
        style={{
          background: `oklch(0.18 0.025 45)`,
        }}
      >
        {/* Breathing lantern glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-lantern-breathe"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 110%,
              oklch(0.553 0.195 38.402 / 0.50) 0%,
              transparent 65%)`,
          }}
        />

        <div className="relative flex flex-col items-center gap-6 px-6 py-20 text-center">
          <Badge
            variant="outline"
            className="h-auto px-3 py-1 border-[oklch(0.78_0.14_48)]/40 bg-[oklch(0.78_0.14_48)]/15 text-[oklch(0.78_0.14_48)] font-medium"
          >
            Free while we're in beta
          </Badge>
          <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl max-w-lg leading-tight">
            Start capturing your practice.
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            No dance vocabulary required. No setup beyond uploading a video.
            Just the loop that helps you actually retain what you learn.
          </p>
          <Button
            size="lg"
            asChild
            className="px-10 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-warm-md"
          >
            <Link to="/signup">Join the Beta →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
