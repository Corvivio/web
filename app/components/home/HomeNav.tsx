import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function HomeNav() {
  return (
    <nav aria-label="Main navigation" className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="font-heading text-xl font-extrabold tracking-tight text-primary transition-opacity duration-150 hover:opacity-80"
        >
          Corvivio
        </Link>
        <Button size="sm" asChild>
          <Link to="/signup">Join the Beta</Link>
        </Button>
      </div>
    </nav>
  )
}
