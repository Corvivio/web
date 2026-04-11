import { useClerk, useUser } from "@clerk/react-router"
import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Play, Upload } from "lucide-react"
import HomeFooter from "~/components/home/HomeFooter"
import UploadVideoDialog from "~/components/UploadVideoDialog"
import { useApi } from "~/lib/api"

type ApiVideo = {
  id: string
  title: string
  danceStyle: string | null
  createdAt: string
}

const DANCE_STYLE_LABELS: Record<string, string> = {
  salsa_on1: "Salsa On1",
  salsa_on2: "Salsa On2",
  bachata: "Bachata",
  bachata_sensual: "Bachata Sensual",
}

type VideoSession = {
  id: string
  title: string
  date: string
  danceStyle: string | null
  gradientFrom: string
  gradientVia?: string
  gradientTo: string
}

const GRADIENT_PALETTE = [
  { from: "oklch(0.553 0.195 38.402)", via: "oklch(0.62 0.18 45)", to: "oklch(0.38 0.12 35)" },
  { from: "oklch(0.455 0.138 82)", via: "oklch(0.55 0.16 75)", to: "oklch(0.32 0.09 80)" },
  { from: "oklch(0.42 0.09 200)", via: "oklch(0.30 0.07 220)", to: "oklch(0.20 0.04 240)" },
  { from: "oklch(0.50 0.15 15)", via: "oklch(0.35 0.12 25)", to: "oklch(0.22 0.05 30)" },
  { from: "oklch(0.48 0.13 290)", via: "oklch(0.35 0.10 300)", to: "oklch(0.22 0.05 310)" },
  { from: "oklch(0.38 0.10 155)", via: "oklch(0.28 0.07 165)", to: "oklch(0.18 0.03 170)" },
]

function gradientForId(id: string) {
  const idx =
    id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    GRADIENT_PALETTE.length
  return GRADIENT_PALETTE[idx]
}

function toVideoSession(v: ApiVideo): VideoSession {
  const g = gradientForId(v.id)
  return {
    id: v.id,
    title: v.title,
    date: new Date(v.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    danceStyle: v.danceStyle,
    gradientFrom: g.from,
    gradientVia: g.via,
    gradientTo: g.to,
  }
}

const MAX_VISIBLE = 6

function VideoCard({ video }: { video: VideoSession }) {
  const thumbnailGradient = video.gradientVia
    ? `linear-gradient(135deg, ${video.gradientFrom} 0%, ${video.gradientVia} 50%, ${video.gradientTo} 100%)`
    : `linear-gradient(135deg, ${video.gradientFrom} 0%, ${video.gradientTo} 100%)`

  return (
    <Link
      to={`/practice/${video.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 2px 12px oklch(0.553 0.195 38.402 / 0.10)" }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 28px oklch(0.553 0.195 38.402 / 0.22)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 12px oklch(0.553 0.195 38.402 / 0.10)"
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-video"
        style={{ background: thumbnailGradient }}
      >
        {/* Ambient highlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 30% 30%, oklch(1 0 0 / 0.06) 0%, transparent 60%)",
          }}
        />

        {/* Play overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "oklch(0 0 0 / 0.25)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.553 0.195 38.402 / 0.90)" }}
          >
            <Play className="size-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-1.5 px-4 py-3 bg-card">
        <p className="font-heading font-semibold text-sm text-foreground leading-snug line-clamp-1">
          {video.title}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="outline"
            className="border-primary/20 text-muted-foreground text-[10px] h-auto py-0.5 px-2 rounded-md font-normal w-fit"
          >
            {video.date}
          </Badge>
          {video.danceStyle && (
            <Badge
              variant="outline"
              className="border-primary/20 text-primary/70 text-[10px] h-auto py-0.5 px-2 rounded-md font-normal w-fit"
            >
              {DANCE_STYLE_LABELS[video.danceStyle] ?? video.danceStyle}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}

function VideoCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-muted" />
      <div className="flex flex-col gap-2 px-4 py-3 bg-card">
        <div className="h-3.5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const api = useApi()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [videos, setVideos] = useState<ApiVideo[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/signin")
    }
  }, [isLoaded, isSignedIn, navigate])

  useEffect(() => {
    if (!isSignedIn) return
    api.get<ApiVideo[]>("/videos").then((res) => {
      if ("data" in res && res.data) setVideos(res.data)
      setVideosLoading(false)
    })
  }, [isSignedIn])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const firstName = user.firstName ?? user.username ?? "dancer"
  const sessions = videos.map(toVideoSession)
  const visibleSessions = showAll ? sessions : sessions.slice(0, MAX_VISIBLE)
  const hasMore = sessions.length > MAX_VISIBLE

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="font-heading font-extrabold text-xl text-primary tracking-tight"
        >
          corvivio
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={firstName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            )}
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
        {/* Greeting */}
        <div>
          <h1 className="font-heading font-extrabold text-4xl text-foreground mb-1.5 tracking-tight">
            Hey, {firstName}.
          </h1>
          <p className="text-muted-foreground text-base">
            Here's where your practice lives.
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
          aria-hidden="true"
        />

        {/* Action row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Practice */}
          <Link
            to="/dashboard"
            className="group relative overflow-hidden rounded-2xl flex flex-col justify-between gap-6 p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "oklch(0.553 0.195 38.402)",
              boxShadow: "0 4px 24px oklch(0.553 0.195 38.402 / 0.30)",
            }}
          >
            {/* Shimmer on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(1 0 0 / 0.08) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <Play className="size-6 text-white fill-white ml-0.5" />
              </div>
              <Badge className="bg-white/15 text-white border border-white/20 text-xs h-auto py-0.5 px-2 backdrop-blur-sm">
                Ready
              </Badge>
            </div>
            <div className="relative z-10">
              <p className="font-heading font-extrabold text-2xl text-white leading-tight">
                Start Practice
              </p>
              <p className="text-white/65 text-sm mt-1">Resume where you left off</p>
            </div>
          </Link>

          {/* Upload Video */}
          <button
            onClick={() => setUploadOpen(true)}
            className="group relative overflow-hidden rounded-2xl flex flex-col justify-between gap-6 p-6 transition-all duration-300 hover:-translate-y-0.5 text-left w-full cursor-pointer"
            style={{
              background: "oklch(0.985 0.008 70)",
              boxShadow: "0 4px 24px oklch(0.553 0.195 38.402 / 0.08)",
              border: "1.5px solid oklch(0.822 0.043 22 / 0.50)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.553 0.195 38.402 / 0.04) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.553 0.195 38.402 / 0.10)" }}
              >
                <Upload className="size-6 text-primary" />
              </div>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs h-auto py-0.5 px-2"
              >
                New
              </Badge>
            </div>
            <div className="relative z-10">
              <p className="font-heading font-extrabold text-2xl text-foreground leading-tight">
                Upload New Video
              </p>
              <p className="text-muted-foreground text-sm mt-1">Add a class recording</p>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div
          className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
          aria-hidden="true"
        />

        {/* Video gallery */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="font-heading font-extrabold text-2xl text-foreground">
              Your Videos
            </h2>
            {!videosLoading && (
              <Badge
                variant="outline"
                className="border-primary/30 text-primary ml-1"
              >
                {videos.length}
              </Badge>
            )}
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No videos yet — upload your first class recording.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleSessions.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              {hasMore && !showAll && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={() => setShowAll(true)}>
                    See all {sessions.length} videos
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <HomeFooter />

      <UploadVideoDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          setUploadOpen(false)
          // Re-fetch videos after a successful upload
          api.get<ApiVideo[]>("/videos").then((res) => {
            if ("data" in res && res.data) setVideos(res.data)
          })
        }}
      />
    </div>
  )
}
