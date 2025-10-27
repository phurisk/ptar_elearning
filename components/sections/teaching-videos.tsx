"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Play, Youtube, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { teachingVideos } from "@/lib/dummy-data"
import http from "@/lib/http"

type VideoItem = {
  id: string | number
  title: string
  youtubeId: string
  description: string
}

const fallbackVideos: VideoItem[] = teachingVideos.map((video, idx) => ({
  id: video.id ?? idx,
  title: video.title ?? "",
  youtubeId: video.youtubeId ?? "",
  description: video.description ?? "",
}))

function extractYoutubeId(input?: unknown): string | null {
  if (!input) return null
  const raw = String(input).trim()
  if (!raw) return null

  const iframeSrcMatch = raw.match(/src=["']([^"']+)["']/i)
  const candidate = iframeSrcMatch?.[1] ?? raw
  const decoded = candidate.replace(/&amp;/g, "&").trim()

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = decoded.match(pattern)
    if (match?.[1]) return match[1]
  }

  const queryMatch = decoded.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (queryMatch?.[1]) return queryMatch[1]

  const idMatch = decoded.match(/([A-Za-z0-9_-]{11})/)
  return idMatch?.[1] ?? null
}

function VideoModal({
  isOpen,
  youtubeId,
  title,
  onClose,
}: {
  isOpen: boolean
  youtubeId: string | null
  title?: string
  onClose: () => void
}) {
 
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])


  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen || !youtubeId) return null

 
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
      
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-2 bg-background/90 hover:bg-background transition"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

      
        <div className="aspect-video w-full">
          <iframe
            title={title ?? "YouTube video"}
            src={src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default function TeachingVideos() {
  const [videos, setVideos] = useState<VideoItem[]>(fallbackVideos)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<VideoItem | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const params = new URLSearchParams({ postType: "วิดีโอแนะนำ-หน้าแรก", limit: "12" })
        const res = await http.get(`/api/posts?${params.toString()}`)
        const json: any = res.data ?? null
        const list: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : []

        const mapped = list
          .filter((item) => item?.postType?.name === "วิดีโอแนะนำ-หน้าแรก")
          .map((item: any, idx: number) => {
            const youtubeId = extractYoutubeId(item?.content)
            if (!youtubeId) return null

            const title =
              typeof item?.title === "string"
                ? item.title
                : item?.title != null
                ? String(item.title)
                : ""
            const descriptionRaw =
              typeof item?.excerpt === "string"
                ? item.excerpt
                : item?.excerpt != null
                ? String(item.excerpt)
                : ""
            const description = descriptionRaw
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim()

            return {
              id: item?.id ?? idx,
              title,
              youtubeId,
              description,
            }
          })
          .filter((video): video is VideoItem => !!video?.youtubeId)

        if (!mounted) return

        if (res.status >= 200 && res.status < 300 && mapped.length) {
          setVideos(mapped)
        } else {
          console.warn("[TeachingVideos] API ไม่คืนข้อมูลที่ต้องการ → ใช้ fallback")
          setVideos(fallbackVideos)
        }
      } catch (error) {
        console.error("[TeachingVideos] Failed to load videos", error)
        if (mounted) setVideos(fallbackVideos)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openVideo = useCallback((video: VideoItem) => {
    setActive(video)
    setOpen(true)
  }, [])

  const closeVideo = useCallback(() => {
    setOpen(false)
  
    setTimeout(() => setActive(null), 150)
  }, [])

  return (
    <section className="pt-0 pb-10 lg:pt-24 lg:pb-5 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        <div className="text-center mb-5">
          <h2 className="text-xl lg:text-2xl font-bold text-primary-foreground mb-4 text-balance bg-primary px-8 py-4 w-fit mx-auto rounded-full shadow-sm">ตัวอย่างการสอน</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            ดูตัวอย่างวิธีการสอนของผู้เชี่ยวชาญ ที่ทำให้การเรียนรู้เป็นเรื่องง่ายและเข้าใจได้
          </p>
        </div>

    
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer pt-0"
              onClick={() => openVideo(video)}
            >
              <CardContent className="p-0">
   
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

             
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                    <Youtube className="w-4 h-4 mr-1" />
                    YouTube
                  </div>
                </div>

            
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-balance group-hover:text-primary transition-colors duration-200">
                    {video.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{video.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

    
        <div className="text-center ">
          <h3 className="text-2xl font-bold text-foreground mb-4">ต้องการดูวิดีโอเพิ่มเติม?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto ">ติดตาม YouTube Channel ของเราเพื่อดูวิดีโอการสอนเพิ่มเติม</p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white transform transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={() => window.open("https://www.youtube.com/@Chemistar", "_blank")}
          >
            <Youtube className="w-5 h-5 size-5 mr-2 " />
            ติดตาม YouTube
          </Button>
        </div>
      </div>

    
      <VideoModal
        isOpen={open}
        youtubeId={active?.youtubeId ?? null}
        title={active?.title}
        onClose={closeVideo}
      />
    </section>
  )
}
