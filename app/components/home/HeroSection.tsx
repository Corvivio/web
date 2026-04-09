import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 pt-20 pb-16 text-center"
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
      <h1 className="max-w-4xl animate-in font-heading text-[2.75rem] leading-[1.05] font-extrabold tracking-tight text-foreground duration-700 fill-mode-both fade-in slide-in-from-bottom-6 sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl">
        <span className="text-primary">Never forget</span> a combo again.
      </h1>

      <p className="mt-6 max-w-xl animate-in text-lg leading-relaxed text-muted-foreground/90 duration-700 fill-mode-both [animation-delay:150ms] fade-in slide-in-from-bottom-4 md:text-xl">
        Add your class videos. Corvivio brings them back right before they slip
        away.
      </p>

      <div className="mt-10 flex w-full max-w-xs animate-in flex-col items-stretch gap-3 duration-700 fill-mode-both [animation-delay:300ms] fade-in slide-in-from-bottom-4 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
        <Button size="lg" asChild className="px-8 text-base">
          <Link to="/signup">Join the Beta</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="border-foreground/30 px-8 text-base hover:bg-foreground/5"
        >
          <a href="#how-it-works">See how it works</a>
        </Button>
      </div>

      <div className="animate-scroll-bob mt-16 flex flex-col items-center gap-2 text-foreground/40">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="h-6 w-px bg-foreground/30" />
      </div>
    </section>
  )
}
