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
    <Card className="rounded-2xl hover:ring-primary/30 transition-all">
      <CardHeader>
        <Badge
          variant="outline"
          className="w-fit border-primary/30 bg-primary/10 text-primary"
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
