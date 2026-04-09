export default function HomeFooter() {
  return (
    <footer className="border-t border-primary/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
        <span className="font-heading text-sm font-bold text-primary">
          Corvivio{" "}
          <span className="font-normal text-muted-foreground">© 2026</span>
        </span>
        <span className="text-primary/60 italic">
          Never forget a combo again.
        </span>
      </div>
    </footer>
  )
}
