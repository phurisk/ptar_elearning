import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { Award, Target, GraduationCap, School } from "lucide-react"

export default function AboutTeacher() {
  return (
    <section className="pt-10 pb-10 lg:pt-24 lg:pb-5 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-x-8 gap-y-12 items-start">
          <div className="space-y-4 text-center md:text-left max-w-2xl mx-auto md:mx-0 md:col-span-7 md:col-start-6 md:row-start-1">
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">อาจารย์ Demo</h2>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-foreground text-pretty">สถาบันการเรียนรู้ออนไลน์</h3>
              <p className="text-muted-foreground text-pretty">(แพลตฟอร์มการเรียนรู้สำหรับทุกคน)</p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-1 md:row-start-1 md:row-span-2">
            <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-none mx-auto md:mx-0">
              <Card className="overflow-hidden shadow-2xl p-0 border-border">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=520&h=650&fit=crop&crop=center"
                      alt="อาจารย์ Demo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 520px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </CardContent>
              </Card>
              <div className="absolute right-2 bottom-2 md:right-4 md:bottom-4 z-10 bg-primary text-primary-foreground rounded-2xl shadow-xl p-3 md:p-4">
                <Award className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto md:mx-0 text-left md:col-span-7 md:col-start-6 md:row-start-2 space-y-8">
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" /> ประสบการณ์ / ผลงาน
              </h4>
              <div className="space-y-3">
                {[
                  "ผู้เชี่ยวชาญด้านการสอนออนไลน์มากกว่า 10 ปี",
                  "พัฒนาหลักสูตรการเรียนรู้สำหรับนักเรียนทุกระดับ",
                  "ผู้ก่อตั้งแพลตฟอร์มการเรียนรู้ออนไลน์ชั้นนำ",
                  "วิทยากรในการประชุมเทคโนโลยีการศึกษาระดับชาติ",
                  "ผู้เขียนหนังสือและเนื้อหาการเรียนรู้มากกว่า 50 เล่ม",
                  "ที่ปรึกษาโครงการพัฒนาการศึกษาดิจิทัล",
                  "ผู้นำในการใช้เทคโนโลยี AI เพื่อการศึกษา"
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    className="flex items-start gap-3 min-w-0"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed text-pretty break-words whitespace-pre-line sm:whitespace-normal">
                      {achievement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" /> ปัจจุบัน
              </h4>
              <div className="flex flex-wrap gap-2">
                {["ผู้อำนวยการสถาบันการเรียนรู้ออนไลน์", "ที่ปรึกษาด้านเทคโนโลยีการศึกษา"].map((position, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground px-3 py-1 text-sm cursor-default"
                  >
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-12 md:col-start-1 md:row-start-3">
            <div className="max-w-5xl mx-auto">
              <h4 className="text-2xl font-semibold text-foreground flex items-center justify-start gap-2 mb-6">
                <GraduationCap className="h-6 w-6 text-primary" /> การศึกษา
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-lg p-2 shadow-sm flex items-center justify-center w-20 h-20">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-card-foreground mb-1">มัธยมศึกษา</h5>
                      <p className="text-muted-foreground leading-relaxed">โรงเรียนสาธิตมหาวิทยาลัย</p>
                      <p className="text-sm text-muted-foreground mt-1">(โรงเรียนชั้นนำของประเทศ)</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-lg p-2 shadow-sm flex items-center justify-center w-20 h-20">
                      <School className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-card-foreground mb-1">ปริญญาตรี</h5>
                      <p className="text-muted-foreground leading-relaxed">คณะวิทยาศาสตร์</p>
                      <p className="text-sm text-muted-foreground mt-1">มหาวิทยาลัยชั้นนำ</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-lg p-2 shadow-sm flex items-center justify-center w-20 h-20">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-card-foreground mb-1">ปริญญาโท</h5>
                      <p className="text-muted-foreground leading-relaxed">คณะเทคโนโลยีสารสนเทศ</p>
                      <p className="text-sm text-muted-foreground mt-1">มหาวิทยาลัยเทคโนโลยี</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-lg p-2 shadow-sm flex items-center justify-center w-20 h-20">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-card-foreground mb-1">ปริญญาเอก</h5>
                      <p className="text-muted-foreground leading-relaxed">คณะครุศาสตร์ (เทคโนโลยีการศึกษา)</p>
                      <p className="text-sm text-muted-foreground mt-1">มหาวิทยาลัยชั้นนำ (กำลังศึกษา)</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
