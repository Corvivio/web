import { useState, useEffect } from "react"
import { Link } from "react-router"
import { useUser } from "@clerk/react-router"
import { Button } from "~/components/ui/button"

export default function HomeNav() {
  const { isSignedIn } = useUser()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 z-50 w-full transition-[background,border-color,backdrop-filter] duration-300"
      style={{
        background: scrolled ? "oklch(0.985 0.008 70 / 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "oklch(0.822 0.043 22 / 0.18)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-primary transition-opacity duration-150 hover:opacity-80"
        >
          <img src="/corvivio-icon.svg" alt="" aria-hidden="true" className="h-7 w-7" />
          corvivio
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Button size="sm" asChild>
            {isSignedIn ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <Link to="/signup">Join the Beta</Link>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}
