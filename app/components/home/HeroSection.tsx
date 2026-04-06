import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-24 text-center bg-background"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 50% -5%,
            oklch(0.553 0.195 38.402 / 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 40% 25% at 50% 0%,
            oklch(0.553 0.195 38.402 / 0.35) 0%, transparent 55%)
        `,
      }}
    >
      <Badge
        variant="outline"
        className="mb-6 h-auto border-primary/40 bg-primary/10 px-3 py-1 text-primary"
      >
        V0.1 Beta — Now Open
      </Badge>

      <h1 className="font-heading text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl max-w-4xl">
        Your dance class deserves more than{" "}
        <span className="text-primary">memory.</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
        Record after class. Write what you felt. Let Corvivio schedule the rest — so nothing you learned disappears.
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <Button size="lg" asChild className="px-8 text-base">
          <Link to="/signup">Join the Beta</Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="px-8 text-base">
          <a href="#how-it-works">See how it works</a>
        </Button>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground/40">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="h-6 w-px bg-muted-foreground/20" />
      </div>
    </section>
  )
}
