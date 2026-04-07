import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-24 text-center bg-background"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 120% 80% at 50% -15%,
            oklch(0.553 0.195 38.402 / 0.40) 0%,
            oklch(0.553 0.195 38.402 / 0.15) 45%,
            transparent 72%),
          radial-gradient(ellipse 60% 40% at 30% -5%,
            oklch(0.553 0.195 38.402 / 0.25) 0%,
            transparent 55%)
        `,
      }}
    >
      <Badge
        variant="outline"
        className="mb-6 h-auto border-primary/50 bg-primary/12 px-3 py-1 text-primary font-semibold tracking-wide"
      >
        V0.1 Beta — Now Open
      </Badge>

      <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both font-heading text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl max-w-4xl">
        Your dance class deserves more than{" "}
        <span className="text-primary">memory.</span>
      </h1>

      <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both [animation-delay:150ms] mt-6 max-w-xl text-lg text-muted-foreground/90 md:text-xl leading-relaxed">
        Record after class. Write what you felt. Let Corvivio schedule the rest — so nothing you learned disappears.
      </p>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both [animation-delay:300ms] mt-10 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <Button size="lg" asChild className="px-8 text-base">
          <Link to="/signup">Join the Beta</Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="px-8 text-base border-foreground/30 hover:bg-foreground/5">
          <a href="#how-it-works">See how it works</a>
        </Button>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 text-foreground/40 animate-scroll-bob">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="h-6 w-px bg-foreground/30" />
      </div>
    </section>
  )
}
