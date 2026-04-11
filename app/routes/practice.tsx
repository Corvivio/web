import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent } from "~/components/ui/card"
import HomeFooter from "~/components/home/HomeFooter"
import { useApi } from "~/lib/api"
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "../../components/kibo-ui/video-player"

type PracticeTip = {
  id: string
  body: string
  position: number
  dismissed: boolean
}

type Card = {
  id: string
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
  lastReviewedAt: string | null
}

type VideoDetail = {
  id: string
  title: string
  danceStyle: string | null
  createdAt: string
  practiceTips: PracticeTip[]
  card: Card | null
}

type ReviewResult = {
  card: Card
}

const DANCE_STYLE_LABELS: Record<string, string> = {
  salsa_on1: "Salsa On1",
  salsa_on2: "Salsa On2",
  bachata: "Bachata",
  bachata_sensual: "Bachata Sensual",
}

// Three accent colour schemes cycling over tips
const TIP_ACCENTS = [
  {
    bar: "from-primary/40 via-primary/70 to-primary/40",
    icon: "bg-primary/10",
    text: "text-primary",
  },
  {
    bar: "from-secondary/40 via-secondary/70 to-secondary/40",
    icon: "bg-secondary/10",
    text: "text-secondary",
  },
  {
    bar: "from-primary/30 via-secondary/50 to-primary/30",
    icon: "bg-primary/10",
    text: "text-primary",
  },
]

function TipNumber({
  n,
  accent,
}: {
  n: number
  accent: (typeof TIP_ACCENTS)[0]
}) {
  return (
    <div
      className={`h-8 w-8 rounded-lg ${accent.icon} flex items-center justify-center`}
    >
      <span className={`font-heading text-sm font-bold ${accent.text}`}>
        {n}
      </span>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 border-b border-border/50 px-6 py-4">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
      </header>
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
        <div className="flex flex-col gap-3">
          <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </main>
    </div>
  )
}

export default function PracticePage() {
  const { videoId } = useParams<{ videoId: string }>()
  const api = useApi()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [videoData, setVideoData] = useState<VideoDetail | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [rated, setRated] = useState(false)
  const [nextDueDate, setNextDueDate] = useState<string | null>(null)

  useEffect(() => {
    if (!videoId) {
      navigate("/dashboard")
      return
    }

    Promise.all([
      api.get<VideoDetail>(`/videos/${videoId}`),
      api.get<{ downloadUrl: string }>(`/videos/${videoId}/download-url`),
    ]).then(([detailRes, urlRes]) => {
      if ("error" in detailRes) {
        setLoadError(detailRes.error ?? "Unknown error")
      } else if ("error" in urlRes) {
        setLoadError(urlRes.error ?? "Unknown error")
      } else {
        setVideoData(detailRes.data ?? null)
        setDownloadUrl(urlRes.data?.downloadUrl ?? null)
      }
      setLoading(false)
    })
  }, [videoId])

  async function handleRate(rating: "again" | "got_it" | "easy") {
    if (!videoData?.card) return
    setSubmitting(true)
    const res = await api.post<ReviewResult>("/training/review", {
      cardId: videoData.card.id,
      rating,
    })
    setSubmitting(false)
    if ("data" in res && res.data) {
      setNextDueDate(res.data.card.dueDate)
      setRated(true)
    }
  }

  if (loading) return <PageSkeleton />

  if (loadError || !videoData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">
          {loadError ?? "Video not found."}
        </p>
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 size-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    )
  }

  const formattedDate = new Date(videoData.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )

  const formattedDueDate = nextDueDate
    ? new Date(nextDueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-border/50 px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </Button>
        <div
          className="ml-auto h-6 w-1 rounded-full bg-primary/30"
          aria-hidden="true"
        />
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
        {/* Video player */}
        <section
          className="max-h-[65vh] overflow-hidden rounded-lg"
          style={{ boxShadow: "0 8px 40px oklch(0.553 0.195 38.402 / 0.18)" }}
        >
          {downloadUrl ? (
            <VideoPlayer className="max-h-[65vh] w-full overflow-hidden">
              <VideoPlayerContent
                slot="media"
                src={downloadUrl}
                preload="auto"
              />
              <VideoPlayerControlBar>
                <VideoPlayerPlayButton />
                <VideoPlayerSeekBackwardButton seekOffset={10} />
                <VideoPlayerSeekForwardButton seekOffset={10} />
                <VideoPlayerTimeRange />
                <VideoPlayerTimeDisplay showDuration />
                <VideoPlayerMuteButton />
                <VideoPlayerVolumeRange />
              </VideoPlayerControlBar>
            </VideoPlayer>
          ) : (
            <div
              className="flex aspect-video w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.025 45) 0%, oklch(0.12 0.010 155) 100%)",
              }}
            >
              <span className="text-sm text-white/40">Video unavailable</span>
            </div>
          )}
        </section>

        {/* Title + meta */}
        <section className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl leading-tight font-extrabold text-foreground">
            {videoData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-auto rounded-md border-primary/20 px-2 py-0.5 text-xs font-normal text-muted-foreground"
            >
              {formattedDate}
            </Badge>
            {videoData.danceStyle && (
              <Badge
                variant="outline"
                className="h-auto rounded-md border-primary/20 px-2 py-0.5 text-xs font-normal text-primary/70"
              >
                {DANCE_STYLE_LABELS[videoData.danceStyle] ??
                  videoData.danceStyle}
              </Badge>
            )}
          </div>
        </section>

        {/* Divider */}
        <div
          className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
          aria-hidden="true"
        />

        {/* Practice tips */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div
              className="h-6 w-1 rounded-full bg-primary"
              aria-hidden="true"
            />
            <h2 className="font-heading text-xl font-extrabold text-foreground">
              Practice Tips
            </h2>
            {videoData.practiceTips.length > 0 && (
              <Badge
                variant="outline"
                className="ml-1 border-primary/30 text-primary"
              >
                {videoData.practiceTips.length}
              </Badge>
            )}
          </div>

          {videoData.practiceTips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tips yet for this session.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videoData.practiceTips.map((tip, i) => {
                const accent = TIP_ACCENTS[i % TIP_ACCENTS.length]
                return (
                  <Card
                    key={tip.id}
                    className="overflow-hidden rounded-2xl pt-0"
                  >
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${accent.bar}`}
                      aria-hidden="true"
                    />
                    <CardContent className="flex flex-col gap-2 pt-5">
                      <TipNumber n={tip.position + 1} accent={accent} />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {tip.body}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Rating section */}
        {videoData.card && (
          <>
            <div
              className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
              aria-hidden="true"
            />

            <section>
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="h-6 w-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <h2 className="font-heading text-xl font-extrabold text-foreground">
                  How did it go?
                </h2>
              </div>

              {rated ? (
                <div
                  className="flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center"
                  style={{
                    background: "oklch(0.985 0.008 70)",
                    border: "1.5px solid oklch(0.822 0.043 22 / 0.40)",
                  }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "oklch(0.553 0.195 38.402 / 0.12)" }}
                  >
                    <CheckCircle2 className="size-7 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 font-heading text-lg font-extrabold text-foreground">
                      Session logged.
                    </p>
                    {formattedDueDate && (
                      <p className="text-sm text-muted-foreground">
                        Next review scheduled for{" "}
                        <span className="font-medium text-foreground">
                          {formattedDueDate}
                        </span>
                        .
                      </p>
                    )}
                  </div>
                  <Button variant="outline" asChild className="mt-2">
                    <Link to="/dashboard">Back to dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Again */}
                  <button
                    disabled={submitting}
                    onClick={() => handleRate("again")}
                    className="group flex cursor-pointer flex-col gap-2 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: "oklch(0.985 0.008 70)",
                      border: "1.5px solid oklch(0.65 0.15 25 / 0.25)",
                      boxShadow: "0 2px 10px oklch(0.65 0.15 25 / 0.08)",
                    }}
                  >
                    <span
                      className="font-heading text-base font-extrabold"
                      style={{ color: "oklch(0.50 0.14 25)" }}
                    >
                      Again
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      Didn't get it — reset the interval and review soon.
                    </span>
                  </button>

                  {/* Got it */}
                  <button
                    disabled={submitting}
                    onClick={() => handleRate("got_it")}
                    className="group flex cursor-pointer flex-col gap-2 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: "oklch(0.553 0.195 38.402)",
                      boxShadow: "0 2px 10px oklch(0.553 0.195 38.402 / 0.28)",
                    }}
                  >
                    <span className="font-heading text-base font-extrabold text-white">
                      Got It
                    </span>
                    <span className="text-xs leading-relaxed text-white/70">
                      Making progress — move the interval forward.
                    </span>
                  </button>

                  {/* Easy */}
                  <button
                    disabled={submitting}
                    onClick={() => handleRate("easy")}
                    className="group flex cursor-pointer flex-col gap-2 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: "oklch(0.985 0.008 70)",
                      border: "1.5px solid oklch(0.55 0.13 155 / 0.30)",
                      boxShadow: "0 2px 10px oklch(0.55 0.13 155 / 0.08)",
                    }}
                  >
                    <span
                      className="font-heading text-base font-extrabold"
                      style={{ color: "oklch(0.40 0.11 155)" }}
                    >
                      Easy
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      Nailed it — boost the interval significantly.
                    </span>
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <HomeFooter />
    </div>
  )
}
