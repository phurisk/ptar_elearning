"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, BookOpen as BookIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/sections/footer"
import { useSearchParams } from "next/navigation"

// Grade Level Enum
enum GradeLevel {
  JUNIOR_HIGH = "JUNIOR_HIGH",
  SENIOR_HIGH = "SENIOR_HIGH"
}

const GRADE_LEVEL_LABELS = {
  [GradeLevel.JUNIOR_HIGH]: "ม.ต้น",
  [GradeLevel.SENIOR_HIGH]: "ม.ปลาย"
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type ApiCourse = {
  id: string
  title: string
  description: string
  price: number
  discountPrice?: number | null
  duration: string | null
  isFree: boolean
  status: string
  instructorId: string
  categoryId: string
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
  instructor?: { id: string; name: string; email: string }
  category?: { id: string; name: string; description?: string }
  _count?: { enrollments: number; chapters: number }
  subject?: string | null
  gradeLevel?: GradeLevel | null
}

type ApiResponse = {
  success: boolean
  data: ApiCourse[]
  pagination?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

const COURSES_API = "/api/courses"
const PAGE_SIZE = 9
const API_FETCH_LIMIT = 100

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const initialGradeLevel = searchParams.get('gradeLevel') || 'all'
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>(initialGradeLevel)
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [data, setData] = useState<ApiCourse[]>([])
  const [allCourses, setAllCourses] = useState<ApiCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCompactPagination, setIsCompactPagination] = useState(false)

  // Load available subjects from API
  useEffect(() => {
    let active = true
    const loadFilters = async () => {
      try {
        const coursesRes = await fetch('/api/courses?limit=200', { cache: "no-store" })
        if (coursesRes.ok) {
          const coursesJson = await coursesRes.json()
          const coursesList = Array.isArray(coursesJson?.data) ? coursesJson.data : []

          const subjectCategories = new Set<string>()

          coursesList.forEach((course: any) => {
            const categoryName = course?.category?.name
            if (categoryName && /^คอร์ส/i.test(categoryName)) {
              subjectCategories.add(categoryName)
            }
          })

          // Set subjects  
          if (active && subjectCategories.size > 0) {
            const subjects = Array.from(subjectCategories).map(name => ({
              id: name,
              name: name
            }))
            setAvailableSubjects([{ id: "all", name: "ทุกวิชา" }, ...subjects])
          }
        }
      } catch (e) {
        console.warn('Failed to load filters:', e)
      }
    }
    loadFilters()
    return () => { active = false }
  }, [])

  // Load all courses initially
  useEffect(() => {
    let active = true
    const loadAllCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const collected: ApiCourse[] = []
        const seen = new Set<string>()
        let page = 1
        let lastReportedPage = 0
        const maxPages = 50

        while (page <= maxPages) {
          const params = new URLSearchParams({ page: String(page), limit: String(API_FETCH_LIMIT) })
          const res = await fetch(`${COURSES_API}?${params.toString()}`, { cache: "no-store" })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json: ApiResponse & { pagination?: { page?: number; totalPages?: number } } = await res.json()
          const list = Array.isArray(json?.data) ? json.data : []

          for (const course of list) {
            if (course?.id && !seen.has(course.id)) {
              seen.add(course.id)
              collected.push(course)
            }
          }

          const pagination = json?.pagination
          const reported = Number(pagination?.page)
          const reportedPage = Number.isFinite(reported) && reported > 0 ? reported : page
          const repeatedPage = page > 1 && reportedPage === lastReportedPage
          lastReportedPage = reportedPage
          const totalPages = Number(pagination?.totalPages)
          const done =
            !list.length ||
            list.length < API_FETCH_LIMIT ||
            (Number.isFinite(totalPages) && reportedPage >= totalPages) ||
            repeatedPage
          if (done) break
          page += 1
        }

        if (active) {
          setData(collected)
          setAllCourses(collected)
          // Debug: Log first course to check gradeLevel field
          if (collected.length > 0) {
            console.log('Sample course data:', collected[0])
            console.log('gradeLevel field:', collected[0].gradeLevel)
          }
        }
      } catch (e: any) {
        if (active) setError(e?.message ?? "Failed to load courses")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadAllCourses()
    return () => { active = false }
  }, [])




  useEffect(() => {
    void searchParams; void data
  }, [data, searchParams])

  // Available grade levels from enum
  const availableGradeLevels = [
    { id: "all", name: "ทุกระดับ" },
    { id: GradeLevel.JUNIOR_HIGH, name: GRADE_LEVEL_LABELS[GradeLevel.JUNIOR_HIGH] },
    { id: GradeLevel.SENIOR_HIGH, name: GRADE_LEVEL_LABELS[GradeLevel.SENIOR_HIGH] }
  ]

  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string; name: string }>>([
    { id: "all", name: "ทุกวิชา" }
  ])



  useEffect(() => {
    setCurrentPage(1)
  }, [selectedGradeLevel, selectedSubject])

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(max-width: 480px)")
    const handleChange = (event: MediaQueryListEvent) => {
      setIsCompactPagination(event.matches)
    }
    setIsCompactPagination(mq.matches)
    mq.addEventListener("change", handleChange)
    return () => {
      mq.removeEventListener("change", handleChange)
    }
  }, [])

  const filteredCourses = useMemo(() => {
    let filtered = allCourses || []

    // Client-side filtering for grade level
    if (selectedGradeLevel !== "all") {
      filtered = filtered.filter(course => {
        // Check if course has gradeLevel property
        if (course.gradeLevel) {
          return course.gradeLevel === selectedGradeLevel
        }
        // Fallback: check category name for grade level indicators
        const categoryName = course.category?.name
        if (categoryName) {
          if (selectedGradeLevel === GradeLevel.JUNIOR_HIGH) {
            return categoryName.includes("ม.ต้น") || categoryName.includes("มต้น")
          }
          if (selectedGradeLevel === GradeLevel.SENIOR_HIGH) {
            return categoryName.includes("ม.ปลาย") || categoryName.includes("มปลาย")
          }
        }
        return false
      })
    }

    // Client-side filtering for subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(course => {
        const categoryName = course.category?.name
        return categoryName === selectedSubject
      })
    }

    return filtered
  }, [allCourses, selectedGradeLevel, selectedSubject])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((filteredCourses.length || 0) / PAGE_SIZE))
  }, [filteredCourses.length])

  const buildPageList = useMemo<(number | "...")[]>(() => {
    if (totalPages <= 1) return [1]
    if (isCompactPagination) {
      const visible = 3
      if (totalPages <= visible) {
        return Array.from({ length: totalPages }, (_, idx) => idx + 1)
      }
      let start = currentPage - Math.floor(visible / 2)
      start = Math.max(1, start)
      let end = start + visible - 1
      if (end > totalPages) {
        end = totalPages
        start = Math.max(1, end - visible + 1)
      }
      return Array.from({ length: visible }, (_, idx) => start + idx)
    }
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1)
    }
    const pages: Array<number | "..."> = [1]
    const middleStart = Math.max(2, currentPage - 2)
    const middleEnd = Math.min(totalPages - 1, currentPage + 2)
    if (middleStart > 2) pages.push("...")
    for (let p = middleStart; p <= middleEnd; p += 1) pages.push(p)
    if (middleEnd < totalPages - 1) pages.push("...")
    pages.push(totalPages)
    return pages
  }, [currentPage, totalPages, isCompactPagination])

  const paginationControls = useMemo<ReactNode[]>(() => {
    const createButton = (
      key: string,
      icon: ReactNode,
      onClick: () => void,
      disabled: boolean,
    ) => (
      <Button
        key={key}
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-0 hover:bg-primary/10 hover:border-primary"
      >
        {icon}
      </Button>
    )

    const items: ReactNode[] = []
    items.push(createButton("first", <ChevronsLeft className="h-4 w-4" />, () => setCurrentPage(1), currentPage === 1))
    items.push(
      createButton(
        "prev",
        <ChevronLeft className="h-4 w-4" />,
        () => setCurrentPage((prev) => Math.max(1, prev - 1)),
        currentPage === 1,
      ),
    )

    const pageItems = buildPageList.map((page, idx) => {
      if (page === "...") {
        return (
          <span
            key={`dots-${idx}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground"
          >
            &#8230;
          </span>
        )
      }
      const isActive = currentPage === page
      const className = [
        "flex h-9 min-w-[2.5rem] shrink-0 items-center justify-center rounded-full px-0",
        isActive
          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
          : "hover:bg-primary/10 hover:border-primary",
      ].join(" ")
      return (
        <Button
          key={`page-${page}`}
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(page as number)}
          className={className}
        >
          {page}
        </Button>
      )
    })
    items.push(...pageItems)

    items.push(
      createButton(
        "next",
        <ChevronRight className="h-4 w-4" />,
        () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
        currentPage === totalPages,
      ),
    )
    items.push(
      createButton(
        "last",
        <ChevronsRight className="h-4 w-4" />,
        () => setCurrentPage(totalPages),
        currentPage === totalPages,
      ),
    )

    return items
  }, [buildPageList, currentPage, totalPages])

  useEffect(() => {
    setCurrentPage((prev) => {
      if (!Number.isFinite(prev) || prev < 1) return 1
      return Math.min(prev, totalPages)
    })
  }, [totalPages])

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredCourses.slice(start, end)
  }, [currentPage, filteredCourses])

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-0 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">คอร์สเรียนทั้งหมด</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              เลือกคอร์สที่เหมาะกับเป้าหมายของคุณ เรียนกับต้าเคมีพี่ต้าผู้เชี่ยวชาญ
            </p>
          </motion.div>


          {/* Removed category filter as requested */}

          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="flex items-center justify-center gap-2 text-foreground mb-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">เลือกระดับ</span>
            </div>
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {availableGradeLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedGradeLevel === level.id ? "default" : "outline"}
                  className={`px-5 py-2 ${selectedGradeLevel === level.id ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "hover:bg-primary/10 hover:border-primary"}`}
                  onClick={() => setSelectedGradeLevel(level.id)}
                >
                  {level.name}
                </Button>
              ))}
            </div>
            <div className="md:hidden max-w-xs mx-auto">
              <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกระดับ" />
                </SelectTrigger>
                <SelectContent>
                  {availableGradeLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            <div className="flex items-center justify-center gap-2 text-foreground mb-3">
              <BookIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">เลือกวิชา</span>
            </div>
            <div className="hidden md:flex flex-wrap justify-center gap-2">
              {availableSubjects.map((s) => (
                <Button
                  key={s.id}
                  variant={selectedSubject === s.id ? "default" : "outline"}
                  className={`px-4 py-1.5 text-sm ${selectedSubject === s.id ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "hover:bg-primary/10 hover:border-primary"}`}
                  onClick={() => setSelectedSubject(s.id)}
                >
                  {s.name}
                </Button>
              ))}
            </div>
            <div className="md:hidden max-w-xs mx-auto">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกวิชา" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>


          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {loading && (
              Array.from({ length: 6 }).map((_, idx) => (
                <motion.div key={`skeleton-${idx}`} variants={fadeInUp}>
                  <Card className="h-full group pt-0">
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Skeleton className="absolute inset-0" />
                        <div className="absolute top-4 left-4">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
            {!loading && error && (
              <div className="col-span-full text-center text-destructive">เกิดข้อผิดพลาด: {error}</div>
            )}
            {!loading && !error && paginatedCourses.map((course) => (
              <motion.div key={course.id} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 group pt-0">
                  <CardContent className="p-0">

                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={course.coverImageUrl || "/placeholder.svg?height=200&width=350"}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">
                          {course.gradeLevel ? GRADE_LEVEL_LABELS[course.gradeLevel] : course.category?.name ?? "คอร์ส"}
                        </Badge>
                      </div>
                    </div>


                    <div className="p-6">
                      {(course.gradeLevel || course.category?.name) && (
                        <div className="mb-2 text-sm font-medium text-primary">
                          {course.gradeLevel ? GRADE_LEVEL_LABELS[course.gradeLevel] : course.category?.name}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-card-foreground mb-2 text-balance line-clamp-2">{course.title}</h3>
                      <p className="text-muted-foreground mb-4 text-pretty line-clamp-2">{course.description}</p>


                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course._count?.enrollments ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course._count?.chapters ?? 0} บทเรียน</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration ?? "-"}</span>
                        </div>
                      </div>

                      {/* No rating data from API; hide rating block */}


                      <div className="flex items-baseline gap-2 mb-6">
                        {course.isFree || (course.price || 0) === 0 ? (
                          <span className="text-2xl font-bold text-green-600">ฟรี</span>
                        ) : (() => {
                          const original = Number(course.price || 0)
                          const d = (course as any).discountPrice as number | null | undefined
                          const hasDiscount = d != null && d < original
                          const effective = hasDiscount ? Number(d) : original
                          return (
                            <>
                              {hasDiscount && (
                                <span className="text-sm text-muted-foreground line-through mr-1">
                                  ฿{original.toLocaleString()}
                                </span>
                              )}
                              <span className="text-2xl font-extrabold text-primary">
                                ฿{effective.toLocaleString()}
                              </span>
                            </>
                          )
                        })()}
                      </div>


                      <Link href={`/courses/${course.id}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">ดูรายละเอียด</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-2">
              {paginationControls}
            </div>
          )}


          {!loading && !error && filteredCourses.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-muted-foreground">ไม่พบคอร์สในหมวดหมู่นี้</p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
