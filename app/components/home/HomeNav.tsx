import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function HomeNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">
          Corvivio
        </span>
        <Button size="sm" asChild>
          <Link to="/signup">Join the Beta</Link>
        </Button>
      </div>
    </nav>
  )
}
