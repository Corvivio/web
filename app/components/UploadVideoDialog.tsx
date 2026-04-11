import { useEffect, useRef, useState } from "react"
import { UploadCloud, Clapperboard, AlertCircle, CheckCircle2, ArrowLeft, Sparkles, Loader2, X, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { useApi } from "~/lib/api"
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerTimeRange,
} from "../../components/kibo-ui/video-player"

type DanceStyle = "salsa_on1" | "salsa_on2" | "bachata" | "bachata_sensual"

const DANCE_STYLE_LABELS: Record<DanceStyle, string> = {
  salsa_on1: "Salsa On1",
  salsa_on2: "Salsa On2",
  bachata: "Bachata",
  bachata_sensual: "Bachata Sensual",
}

type Step = "input" | "review"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function UploadVideoDialog({ open, onOpenChange, onSuccess }: Props) {
  const api = useApi()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Persisted across steps
  const [file, setFile] = useState<File | null>(null)
  const [rawNotes, setRawNotes] = useState("")
  const [danceStyle, setDanceStyle] = useState<DanceStyle | "">("")

  // Set when entering review
  const [title, setTitle] = useState("")
  const [practiceTips, setPracticeTips] = useState<string[]>([])
  const [r2Key, setR2Key] = useState<string | null>(null)

  // Phase flags
  const [step, setStep] = useState<Step>("input")
  const [analyzing, setAnalyzing] = useState(false)
  const [r2Uploading, setR2Uploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [dragging, setDragging] = useState(false)
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) { setLocalVideoUrl(null); return }
    const url = URL.createObjectURL(file)
    setLocalVideoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const canAnalyze = file !== null && !analyzing
  const canSave = title.trim().length > 0 && r2Key !== null && !saving && !r2Uploading

  function reset() {
    setFile(null)
    setRawNotes("")
    setDanceStyle("")
    setTitle("")
    setPracticeTips([])
    setR2Key(null)
    setStep("input")
    setAnalyzing(false)
    setR2Uploading(false)
    setSaving(false)
    setErrorMsg("")
    setDragging(false)
  }

  function handleClose(open: boolean) {
    if (!open && !analyzing && !saving) {
      reset()
      onOpenChange(false)
    } else if (open) {
      onOpenChange(true)
    }
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) return
    setFile(selected)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileSelect(dropped)
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!canAnalyze || !file) return

    setAnalyzing(true)
    setErrorMsg("")

    const dateTitle = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    const r2Promise = api
      .post<{ uploadUrl: string; key: string }>("/videos/upload-url", {
        filename: file.name,
        contentType: file.type || "video/mp4",
      })
      .then(async (urlResult) => {
        if (urlResult.error) throw new Error(urlResult.error)
        const { uploadUrl, key } = urlResult.data!
        const r2Res = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "video/mp4" },
        })
        if (!r2Res.ok) throw new Error(`Storage upload failed (${r2Res.status})`)
        return key
      })

    const resolveR2 = () => {
      setR2Uploading(true)
      r2Promise
        .then((key) => {
          setR2Key(key)
          setR2Uploading(false)
        })
        .catch((err) => {
          setR2Uploading(false)
          setErrorMsg(err instanceof Error ? err.message : "Video upload failed. Please try again.")
        })
    }

    // No notes — skip AI, use date title
    if (!rawNotes.trim()) {
      setTitle(dateTitle)
      setPracticeTips([])
      setStep("review")
      setAnalyzing(false)
      resolveR2()
      return
    }

    // Fire AI in parallel with R2 upload
    const aiPromise = api
      .post<{ suggestedTitle: string; practiceTips: string[] }>("/videos/process-notes", {
        rawNotes: rawNotes.trim(),
        ...(danceStyle ? { danceStyle } : {}),
      })
      .then((result) => {
        if (result.error) throw new Error(result.error)
        return result.data!
      })

    // Transition to review as soon as AI finishes; R2 continues independently
    try {
      const aiResult = await aiPromise
      setTitle(aiResult.suggestedTitle || dateTitle)
      setPracticeTips(aiResult.practiceTips)
      setStep("review")
      setAnalyzing(false)
      resolveR2()
    } catch (err) {
      setAnalyzing(false)
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  function updateTip(i: number, value: string) {
    setPracticeTips((tips) => tips.map((t, idx) => (idx === i ? value : t)))
  }

  function removeTip(i: number) {
    setPracticeTips((tips) => tips.filter((_, idx) => idx !== i))
  }

  function addTip() {
    setPracticeTips((tips) => [...tips, ""])
  }

  async function handleSave() {
    if (!canSave || !r2Key) return

    setSaving(true)
    setErrorMsg("")

    const result = await api.post("/videos", {
      title: title.trim(),
      rawNotes,
      videoUrl: r2Key,
      practiceTips: practiceTips.filter((t) => t.trim().length > 0),
      ...(danceStyle ? { danceStyle } : {}),
    })

    if (result.error) {
      setErrorMsg(result.error)
      setSaving(false)
      return
    }

    reset()
    onSuccess()
  }

  const inputBase =
    "w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-colors disabled:opacity-50"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`rounded-2xl transition-all ${file ? "sm:max-w-4xl" : "sm:max-w-lg"}`}>
        <DialogHeader>
          <DialogTitle className="font-heading font-extrabold text-xl text-foreground">
            {step === "input" ? "Upload a Class Video" : "Review Video"}
          </DialogTitle>
        </DialogHeader>

        {step === "input" ? (
          <form onSubmit={handleAnalyze} className="flex flex-col gap-5 mt-1">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Video preview — shown once a file is selected */}
              {localVideoUrl && (
                <div className="sm:w-[58%] shrink-0 flex flex-col gap-2">
                  <VideoPlayer className="w-full rounded-xl overflow-hidden">
                    <VideoPlayerContent
                      slot="media"
                      src={localVideoUrl}
                      preload="metadata"
                      className="w-full aspect-video object-contain"
                    />
                    <VideoPlayerControlBar>
                      <VideoPlayerPlayButton />
                      <VideoPlayerTimeRange />
                      <VideoPlayerFullscreenButton />
                    </VideoPlayerControlBar>
                  </VideoPlayer>
                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors self-center"
                  >
                    Change video
                  </button>
                </div>
              )}

              {/* Drop zone + notes + style */}
              <div className="flex flex-col gap-5 flex-1 min-w-0">
            {/* Drop zone — hidden once a file is selected */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              disabled={analyzing}
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            {!file && <div
              onClick={() => !analyzing && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 px-6 text-center cursor-pointer transition-colors duration-200"
              style={{
                borderColor: dragging
                  ? "oklch(0.553 0.195 38.402 / 0.70)"
                  : "oklch(0.553 0.195 38.402 / 0.35)",
                background: dragging
                  ? "oklch(0.553 0.195 38.402 / 0.04)"
                  : undefined,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.553 0.195 38.402 / 0.10)" }}
              >
                <UploadCloud className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Drop your video here</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MP4, MOV or WebM · up to 2 GB
                </p>
              </div>
            </div>}

            {/* Raw Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                Class Notes
              </label>
              <textarea
                placeholder="Paste or type your raw notes from class…"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                disabled={analyzing}
                rows={4}
                className={`${inputBase} resize-none`}
              />
            </div>

            {/* Dance Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                Dance Style
              </label>
              <select
                value={danceStyle}
                onChange={(e) => setDanceStyle(e.target.value as DanceStyle | "")}
                disabled={analyzing}
                className={inputBase}
              >
                <option value="">— optional —</option>
                {(Object.keys(DANCE_STYLE_LABELS) as DanceStyle[]).map((key) => (
                  <option key={key} value={key}>
                    {DANCE_STYLE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

              </div>{/* end inner flex-1 column */}
            </div>{/* end two-column row */}

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-3.5 py-3 text-sm text-destructive">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                disabled={analyzing}
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canAnalyze} className="gap-2">
                {analyzing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Analyze Notes
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-5 mt-1">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="Video title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                className={inputBase}
              />
            </div>

            {/* Practice Tips */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                Practice Tips
              </p>
              {practiceTips.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {practiceTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0 text-sm w-5 text-right mt-2.5">{i + 1}.</span>
                      <textarea
                        value={tip}
                        onChange={(e) => {
                          updateTip(i, e.target.value)
                          e.target.style.height = "auto"
                          e.target.style.height = `${e.target.scrollHeight}px`
                        }}
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }
                        }}
                        disabled={saving}
                        placeholder="Tip…"
                        rows={1}
                        className={`${inputBase} flex-1 resize-none overflow-hidden`}
                      />
                      <button
                        type="button"
                        onClick={() => removeTip(i)}
                        disabled={saving}
                        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md mt-1"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={addTip}
                className="gap-1.5 self-start mt-0.5"
              >
                <Plus className="size-4" />
                Add tip
              </Button>
            </div>

            {/* R2 upload indicator */}
            {r2Uploading && (
              <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 border border-border/40 px-3.5 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                <span>Uploading video…</span>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-3.5 py-3 text-sm text-destructive">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                disabled={saving}
                onClick={() => { setStep("input"); setErrorMsg("") }}
                className="gap-1.5"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                type="button"
                disabled={!canSave}
                onClick={handleSave}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Clapperboard className="size-4" />
                    Save Video
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
