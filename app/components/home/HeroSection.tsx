import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center"
      style={{ background: "oklch(0.985 0.008 70)" }}
    >
      {/* Warm top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[8%] left-1/2 -translate-x-1/2"
        style={{
          width: 900,
          height: 700,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 20%, oklch(0.553 0.195 38.402 / 0.18) 0%, oklch(0.553 0.195 38.402 / 0.07) 45%, transparent 72%)",
        }}
      />

      {/* Blob 1 — top-left */}
      <div
        aria-hidden="true"
        className="animate-blob-float pointer-events-none absolute"
        style={
          {
            "--blob-dur": "13s",
            width: 380,
            height: 380,
            top: "-5%",
            left: "-8%",
            borderRadius: "71% 29% 66% 34% / 37% 51% 49% 63%",
            background: "oklch(0.553 0.195 38.402 / 0.07)",
          } as React.CSSProperties
        }
      />
      {/* Blob 2 — bottom-right */}
      <div
        aria-hidden="true"
        className="animate-blob-floatr pointer-events-none absolute"
        style={
          {
            "--blob-dur": "17s",
            width: 460,
            height: 460,
            bottom: "-5%",
            right: "-10%",
            borderRadius: "30% 70% 40% 60% / 50% 30% 70% 50%",
            background: "oklch(0.455 0.138 82 / 0.08)",
          } as React.CSSProperties
        }
      />
      {/* Blob 3 — bottom-left */}
      <div
        aria-hidden="true"
        className="animate-blob-float pointer-events-none absolute"
        style={
          {
            "--blob-dur": "20s",
            width: 200,
            height: 200,
            bottom: "18%",
            left: "6%",
            borderRadius: "71% 29% 66% 34% / 37% 51% 49% 63%",
            background: "oklch(0.553 0.195 38.402 / 0.05)",
          } as React.CSSProperties
        }
      />
      {/* Blob 4 — top-right */}
      <div
        aria-hidden="true"
        className="animate-blob-floatr pointer-events-none absolute"
        style={
          {
            "--blob-dur": "16s",
            width: 160,
            height: 160,
            top: "22%",
            right: "8%",
            borderRadius: "40% 60% 60% 40% / 60% 30% 70% 40%",
            background: "oklch(0.455 0.138 82 / 0.06)",
          } as React.CSSProperties
        }
      />

      {/* Beta badge */}
      <div
        className="mb-8 inline-flex animate-in items-center gap-[0.45rem] rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide text-primary duration-500 fill-mode-both fade-in slide-in-from-bottom-4"
        style={{
          background: "oklch(0.553 0.195 38.402 / 0.10)",
          borderColor: "oklch(0.553 0.195 38.402 / 0.22)",
          animationDelay: "50ms",
        }}
      >
        <span
          className="inline-block size-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
        Free while in beta
      </div>

      {/* Headline */}
      <h1
        className="max-w-[900px] animate-in font-heading leading-[1.0] font-extrabold tracking-[-0.04em] text-foreground duration-[650ms] fill-mode-both fade-in slide-in-from-bottom-6"
        style={{
          fontSize: "clamp(3rem,9vw,7.5rem)",
          animationDelay: "200ms",
        }}
      >
        Dance more, <span className="text-primary">forget less.</span>
      </h1>

      {/* Subline */}
      <p
        className="mt-6 max-w-[460px] animate-in leading-[1.7] text-muted-foreground duration-[650ms] fill-mode-both fade-in slide-in-from-bottom-4"
        style={{
          fontSize: "clamp(1rem,2vw,1.2rem)",
          animationDelay: "380ms",
        }}
      >
        Upload your class videos. Corvivio brings them back right before they
        fade so you actually keep what you learn.
      </p>

      {/* CTAs */}
      <div
        className="mt-10 flex animate-in flex-wrap justify-center gap-4 duration-[650ms] fill-mode-both fade-in slide-in-from-bottom-4"
        style={{ animationDelay: "560ms" }}
      >
        <Button
          size="lg"
          asChild
          className="shadow-warm-md rounded-full px-9 text-base font-bold"
        >
          <Link to="/signup">Join the Beta →</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="rounded-full border-border/45 px-9 text-base font-semibold hover:border-primary/35 hover:text-foreground"
        >
          <a href="#how-it-works">How it works</a>
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="animate-scroll-bob absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/45">
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase">
          scroll
        </span>
        <div className="h-7 w-px bg-current opacity-50" />
      </div>
    </section>
  )
}
