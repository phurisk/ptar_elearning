"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, BookOpen, Clock } from "lucide-react"
import { http } from "@/lib/http"

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
}

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function loadCourses() {
      try {
        setLoading(true)
        setError(null)
        const res = await http.get('/api/courses', {
          params: {
            limit: 4, // Show only 4 recommended courses
            sort: 'popularity' // You can adjust the sorting parameter based on your API
          }
        })
        if (!active) return
        if (res.data?.success) {
          setCourses(res.data.data || [])
        } else {
          throw new Error(res.data?.error || 'Failed to load courses')
        }
      } catch (e: any) {
        if (active) setError(e?.message ?? 'Failed to load courses')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCourses()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="pt-0 pb-10 lg:pt-24 lg:pb-5 bg-background">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3 lg:mb-4 text-balance bg-primary text-primary-foreground px-8 py-4 w-fit mx-auto rounded-full shadow-sm">
            คอร์สแนะนำ
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            คอร์สยอดนิยมที่ได้รับการแนะนำสำหรับคุณ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {loading && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden">
                        <Skeleton className="h-full w-full" />
                      </div>
                      <Skeleton className="absolute top-2 right-2 lg:top-4 lg:right-4 h-5 w-12 rounded-full" />
                    </div>
                    <div className="p-3 md:p-6 space-y-3 md:space-y-4">
                      <Skeleton className="h-4 md:h-5 w-4/5" />
                      <Skeleton className="hidden md:block h-4 w-3/5" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-9 md:h-11 w-full rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {!loading && error && (
            <div className="col-span-full text-center text-red-600 py-10">
              โหลดข้อมูลไม่สำเร็จ: {error}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              ยังไม่มีคอร์สแนะนำ
            </div>
          )}

          {!loading && !error && courses.map((course) => (
            <Card key={course.id} className="h-full hover:shadow-xl transition-shadow duration-300 group pt-0">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={course.coverImageUrl || "/placeholder.svg?height=200&width=350"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">{course.category?.name ?? "คอร์ส"}</Badge>
                  </div>
                </div>

                <div className="p-6">
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

                  <div className="flex items-baseline gap-2 mb-6">
                    {course.isFree || (course.price || 0) === 0 ? (
                      <span className="text-2xl font-bold text-green-600">ฟรี</span>
                    ) : (
                      <>
                        {course.discountPrice && course.discountPrice < course.price && (
                          <span className="text-sm text-muted-foreground line-through mr-1">
                            ฿{course.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-2xl font-extrabold text-primary">
                          ฿{(course.discountPrice || course.price).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">ดูรายละเอียด</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10 lg:mt-12">
          <Link href="/courses">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent h-10 px-4 text-sm md:h-12 md:px-6 md:text-base"
            >
              ดูคอร์สเรียนเพิ่มเติม
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}