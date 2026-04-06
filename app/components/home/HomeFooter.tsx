export default function HomeFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
        <span className="font-heading text-sm font-semibold text-foreground">
          Corvivio{" "}
          <span className="font-normal text-muted-foreground">© 2026</span>
        </span>
        <span className="italic">Made for the dance floor.</span>
      </div>
    </footer>
  )
}
