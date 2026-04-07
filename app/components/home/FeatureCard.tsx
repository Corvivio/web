import type { ReactNode } from "react"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

export default function FeatureCard({
  badge,
  icon,
  title,
  description,
  detail,
}: {
  badge: string
  icon: ReactNode
  title: string
  description: string
  detail: string
}) {
  return (
    <Card className="rounded-2xl pt-0 shadow-warm-sm hover:shadow-warm-md hover:bg-primary/[0.02] transition-all duration-300">
      {/* Warm gradient top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary/70 to-primary/40" aria-hidden="true" />
      <CardHeader className="pt-5">
        <Badge
          variant="outline"
          className="w-fit border-primary/40 bg-primary/10 text-primary font-medium"
        >
          {icon}
          {badge}
        </Badge>
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-xs text-muted-foreground/60 border-t border-border pt-3">{detail}</p>
      </CardContent>
    </Card>
  )
}
