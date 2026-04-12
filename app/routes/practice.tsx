import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Music2, Pencil, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import HomeFooter from "~/components/home/HomeFooter"
import { useApi } from "~/lib/api"
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
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


const DANCE_STYLE_LABELS: Record<string, string> = {
  salsa_on1: "Salsa On1",
  salsa_on2: "Salsa On2",
  bachata: "Bachata",
  bachata_sensual: "Bachata Sensual",
}

// Three accent colour schemes cycling over tips
const TIP_ACCENTS = [
  "from-primary/40 via-primary/70 to-primary/40",
  "from-secondary/40 via-secondary/70 to-secondary/40",
  "from-primary/30 via-secondary/50 to-primary/30",
]


function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 border-b border-border/50 px-6 py-4">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
      </header>
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
        <div className="flex flex-col gap-3">
          <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="aspect-[9/16] w-full animate-pulse rounded-2xl bg-muted sm:aspect-video" />
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
  const [searchParams] = useSearchParams()

  const queueParam = searchParams.get("queue") ?? ""
  const queue = queueParam ? queueParam.split(",").filter(Boolean) : []
  const total = Number(searchParams.get("total") ?? queue.length + 1)
  const current = total - queue.length
  const isInQueue = total > 1
  const isLastVideo = queue.length === 0

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [videoData, setVideoData] = useState<VideoDetail | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [rated, setRated] = useState(false)
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingTips, setEditingTips] = useState(false)
  const [draftTips, setDraftTips] = useState<string[]>([])
  const [savingTips, setSavingTips] = useState(false)

  function navigateToNext() {
    const [nextId, ...remaining] = queue
    if (!nextId) { navigate("/dashboard"); return }
    const params = new URLSearchParams()
    if (remaining.length > 0) params.set("queue", remaining.join(","))
    params.set("total", String(total))
    navigate(`/practice/${nextId}?${params.toString()}`)
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await api.del(`/videos/${videoId}`)
    if (result.error) {
      setDeleting(false)
      return
    }
    setDeleteOpen(false)
    navigate("/dashboard")
  }

  useEffect(() => {
    if (!videoId) {
      navigate("/dashboard")
      return
    }

    setLoading(true)
    setLoadError(null)
    setVideoData(null)
    setDownloadUrl(null)
    setRated(false)
    setRatingOpen(false)
    setIsPortrait(null)
    setSubmitting(false)

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
    const res = await api.post<{ card: Card }>("/training/review", {
      cardId: videoData.card.id,
      rating,
    })
    setSubmitting(false)
    if ("data" in res && res.data) {
      setRated(true)
      setRatingOpen(false)
    }
  }

  function startEditTips() {
    setDraftTips(videoData!.practiceTips.map((t) => t.body))
    setEditingTips(true)
  }

  function cancelEditTips() {
    setEditingTips(false)
    setDraftTips([])
  }

  async function saveEditedTips() {
    setSavingTips(true)
    const filtered = draftTips.filter((t) => t.trim().length > 0)
    const res = await api.put<PracticeTip[]>(`/videos/${videoId}/tips`, {
      tips: filtered.map((body) => ({ body })),
    })
    setSavingTips(false)
    if ("data" in res && res.data) {
      setVideoData((v) => v ? { ...v, practiceTips: res.data! } : v)
      setEditingTips(false)
      setDraftTips([])
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border/50 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="shrink-0 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back to dashboard</span>
          </Link>
        </Button>

        {isInQueue && (
          <span className="text-sm tabular-nums text-muted-foreground">
            {current} of {total}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {rated ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                <CheckCircle2 className="size-4 text-primary" />
                Session logged
              </div>
              <CheckCircle2 className="size-4 text-primary sm:hidden" />
              {isLastVideo ? (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/dashboard">All done!</Link>
                </Button>
              ) : (
                <Button size="sm" onClick={navigateToNext}>
                  Next
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => setRatingOpen(true)}>
              Review Video
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="shrink-0 gap-1.5 text-muted-foreground/60 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </header>

      {/* Rating dialog */}
      <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-extrabold">
              How did it go?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            {videoData.card ? (
              <>
                <button
                  disabled={submitting}
                  onClick={() => handleRate("again")}
                  className="flex cursor-pointer flex-col gap-1.5 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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

                <button
                  disabled={submitting}
                  onClick={() => handleRate("got_it")}
                  className="flex cursor-pointer flex-col gap-1.5 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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

                <button
                  disabled={submitting}
                  onClick={() => handleRate("easy")}
                  className="flex cursor-pointer flex-col gap-1.5 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                This video has no review card — re-upload it to enable spaced repetition.
              </p>
            )}
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-extrabold">
              Delete video?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the video and all its practice tips and review history.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
        {/* Title + meta */}
        <section className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl leading-tight font-extrabold text-foreground">
            {videoData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-auto rounded-md border-primary/20 px-2 py-0.5 text-xs font-normal text-muted-foreground gap-1"
            >
              <Upload className="size-3" />
              {formattedDate}
            </Badge>
            {videoData.danceStyle && (
              <Badge
                variant="outline"
                className="h-auto rounded-md border-primary/20 px-2 py-0.5 text-xs font-normal text-primary/70 gap-1"
              >
                <Music2 className="size-3" />
                {DANCE_STYLE_LABELS[videoData.danceStyle] ??
                  videoData.danceStyle}
              </Badge>
            )}
            {videoData.card && (() => {
              const today = new Date().toISOString().slice(0, 10)
              const isDue = videoData.card!.dueDate <= today
              const formatted = new Date(videoData.card!.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
              return (
                <Badge
                  variant="outline"
                  className={
                    isDue
                      ? "h-auto rounded-md border-primary/40 px-2 py-0.5 text-xs font-normal text-primary gap-1"
                      : "h-auto rounded-md border-border px-2 py-0.5 text-xs font-normal text-muted-foreground/60 gap-1"
                  }
                >
                  <Clock className="size-3" />
                  {formatted}
                </Badge>
              )
            })()}
          </div>
        </section>

        {/* Video player */}
        <section
          className="flex justify-center overflow-hidden rounded-lg"
          style={{ boxShadow: "0 8px 40px oklch(0.553 0.195 38.402 / 0.18)" }}
        >
          {downloadUrl ? (
            <VideoPlayer
              className={
                isPortrait
                  ? "max-h-[80svh] w-auto max-w-full overflow-hidden"
                  : "max-h-[65svh] w-full overflow-hidden"
              }
            >
              <VideoPlayerContent
                slot="media"
                src={downloadUrl}
                preload="auto"
                className="h-full w-full object-contain"
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget
                  setIsPortrait(v.videoHeight > v.videoWidth)
                }}
              />
              <VideoPlayerControlBar>
                <VideoPlayerPlayButton />
                <VideoPlayerSeekBackwardButton seekOffset={10} />
                <VideoPlayerSeekForwardButton seekOffset={10} />
                <VideoPlayerTimeRange />
                <VideoPlayerTimeDisplay showDuration />
                <VideoPlayerFullscreenButton />
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
            {!editingTips && videoData.practiceTips.length > 0 && (
              <Badge
                variant="outline"
                className="ml-1 border-primary/30 text-primary"
              >
                {videoData.practiceTips.length}
              </Badge>
            )}
            {editingTips && draftTips.filter((t) => t.trim().length > 0).length > 0 && (
              <Badge
                variant="outline"
                className="ml-1 border-primary/30 text-primary"
              >
                {draftTips.filter((t) => t.trim().length > 0).length}
              </Badge>
            )}
            <div className="ml-auto flex items-center gap-2">
              {editingTips ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditTips}
                    disabled={savingTips}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEditedTips}
                    disabled={savingTips}
                  >
                    {savingTips ? "Saving…" : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={startEditTips}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {editingTips ? (
            <div className="flex flex-col gap-3">
              {draftTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={tip}
                    onChange={(e) => {
                      const next = [...draftTips]
                      next[i] = e.target.value
                      setDraftTips(next)
                      e.target.style.height = "auto"
                      e.target.style.height = `${e.target.scrollHeight}px`
                    }}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto"
                        el.style.height = `${el.scrollHeight}px`
                      }
                    }}
                    disabled={savingTips}
                    className="flex-1 resize-none overflow-hidden rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDraftTips(draftTips.filter((_, j) => j !== i))}
                    disabled={savingTips}
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDraftTips([...draftTips, ""])}
                disabled={savingTips}
                className="mt-1 w-fit gap-1.5"
              >
                <Plus className="size-3.5" />
                Add tip
              </Button>
            </div>
          ) : videoData.practiceTips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tips yet for this session.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videoData.practiceTips.map((tip, i) => {
                const accent = TIP_ACCENTS[i % TIP_ACCENTS.length]
                return (
                  <div
                    key={tip.id}
                    className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5"
                    style={{ boxShadow: "0 2px 16px oklch(0 0 0 / 0.07)" }}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
                      aria-hidden="true"
                    />
                    <span className="mb-3 block font-heading text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground">
                      {tip.body}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </main>

      <HomeFooter />
    </div>
  )
}
