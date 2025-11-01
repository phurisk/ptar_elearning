# API Endpoint Information

## Frontend Endpoint ที่ใช้

**URL:** `/api/courses`

**Method:** GET

**Parameters:**
- `page`: หมายเลขหน้า (เริ่มจาก 1)
- `limit`: จำนวนรายการต่อหน้า (ใช้ 100)
- `gradeLevel`: (ใหม่) ระดับการศึกษา - ค่าที่ต้องการ: `JUNIOR_HIGH` หรือ `SENIOR_HIGH`
- `categoryId`: (เดิม) ID ของหมวดหมู่

## ตัวอย่าง URL ที่เรียกใช้

```
GET /api/courses?page=1&limit=100
GET /api/courses?page=1&limit=100&gradeLevel=JUNIOR_HIGH
GET /api/courses?page=1&limit=100&gradeLevel=SENIOR_HIGH
```

## Response Structure ที่คาดหวัง

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": 0,
      "discountPrice": 0,
      "duration": "string",
      "isFree": false,
      "status": "string",
      "instructorId": "string",
      "categoryId": "string",
      "coverImageUrl": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "gradeLevel": "JUNIOR_HIGH" | "SENIOR_HIGH" | null,
      "instructor": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "category": {
        "id": "string",
        "name": "string",
        "description": "string"
      },
      "_count": {
        "enrollments": 0,
        "chapters": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 0,
    "totalPages": 0
  }
}
```

## ปัญหาปัจจุบัน

1. **gradeLevel field เป็น null**: แม้ว่าจะเพิ่ม field แล้วแต่ยังไม่มีข้อมูล
2. **ต้องการ enum values**: `JUNIOR_HIGH` (ม.ต้น) และ `SENIOR_HIGH` (ม.ปลาย)

## การแก้ไขที่แนะนำ

1. **Database Schema**: เพิ่ม column `gradeLevel` ในตาราง courses
2. **Enum Definition**: สร้าง enum ที่มีค่า `JUNIOR_HIGH`, `SENIOR_HIGH`
3. **API Filtering**: รองรับการกรองด้วย query parameter `gradeLevel`
4. **Data Migration**: อัปเดตข้อมูลเก่าให้มี gradeLevel

## ตัวอย่างการใช้งาน

```javascript
// ดึงคอร์สทั้งหมด
fetch('/api/courses?page=1&limit=100')

// ดึงเฉพาะคอร์ส ม.ต้น
fetch('/api/courses?page=1&limit=100&gradeLevel=JUNIOR_HIGH')

// ดึงเฉพาะคอร์ส ม.ปลาย  
fetch('/api/courses?page=1&limit=100&gradeLevel=SENIOR_HIGH')
```