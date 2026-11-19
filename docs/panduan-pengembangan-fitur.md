# Panduan Pengembangan Fitur Backend (Team Workflow Guide)

Panduan ini ditujukan untuk seluruh anggota tim pengembang backend SIMEKA agar memiliki standar koding yang konsisten, mudah berkolaborasi, dan terhindar dari konflik Git (*merge conflict*).

---

## 1. Filosofi Arsitektur: Modular Berbasis Fitur

Backend SIMEKA menggunakan pola **Modular Feature-Based (Vertical Slice Architecture)**:
- Kode dikelompokkan **berdasarkan fitur/domain bisnis**, bukan berdasarkan lapisan teknis global.
- Setiap fitur hidup mandiri di dalam folder `src/modules/<nama-fitur>/`.
- Pengembang yang mengerjakan fitur *Laporan* hanya perlu menyentuh `src/modules/reports/`.
- Pengembang yang mengerjakan fitur *Wilayah Konservasi* hanya perlu menyentuh `src/modules/conservation-areas/`.

---

## 2. Struktur Folder Modul Fitur

Setiap folder di `src/modules/<nama-fitur>/` memiliki 6 komponen standar:

```text
src/modules/<nama-fitur>/
├── <nama-fitur>.types.ts    # Definisi antarmuka (interface) data domain & DTO
├── <nama-fitur>.schema.ts   # Validasi request body/query/params menggunakan Zod
├── <nama-fitur>.service.ts  # Logika bisnis & eksekusi SQL query langsung via dbPool
├── <nama-fitur>.controller.ts # Handler HTTP (ekstraksi request, status code, respon JSON)
├── <nama-fitur>.routes.ts   # Definisi rute Express & pemasangan middleware
└── index.ts                 # Entrypoint modul (ekspor router modul)
```

---

## 3. Langkah-demi-Langkah Menambah Fitur Baru

Misalkan Anda ditugaskan membuat fitur baru **Kategori Ancaman (`categories`)**:

### Langkah 1: Buat Folder Modul
```bash
mkdir -p backend/src/modules/categories
```

### Langkah 2: Buat Definisi Tipe (`categories.types.ts`)
```ts
export interface CategoryItem {
  id: string;
  name: string;
  type: "ancaman" | "observasi" | "kondisi";
  description?: string;
}

export interface CreateCategoryInput {
  name: string;
  type: "ancaman" | "observasi" | "kondisi";
  description?: string;
}
```

### Langkah 3: Buat Skema Validasi Zod (`categories.schema.ts`)
```ts
import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nama kategori minimal 3 karakter"),
    type: z.enum(["ancaman", "observasi", "kondisi"], {
      errorMap: () => ({ message: "Tipe kategori tidak valid" })
    }),
    description: z.string().optional()
  })
});
```

### Langkah 4: Tulis Logika Bisnis & SQL di Service (`categories.service.ts`)
```ts
import type { RowDataPacket } from "mysql2";
import { dbPool } from "../../shared/config/database.js";
import type { CategoryItem, CreateCategoryInput } from "./categories.types.js";

export async function getAllCategories(): Promise<CategoryItem[]> {
  const [rows] = await dbPool.query<RowDataPacket[]>(
    "SELECT * FROM categories ORDER BY name ASC"
  );
  return rows as CategoryItem[];
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryItem> {
  const id = `CAT-${Date.now()}`;
  await dbPool.query(
    "INSERT INTO categories (id, name, type, description) VALUES (?, ?, ?, ?)",
    [id, input.name, input.type, input.description ?? null]
  );
  return { id, ...input };
}
```

### Langkah 5: Buat Handler di Controller (`categories.controller.ts`)
Gunakan utilitas `sendSuccess` dan `sendError` dari `../../shared/utils/apiResponse.js`:
```ts
import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import * as categoriesService from "./categories.service.js";

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await categoriesService.getAllCategories();
    sendSuccess(res, list, "Daftar kategori berhasil diambil");
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await categoriesService.createCategory(req.body);
    sendSuccess(res, item, "Kategori baru berhasil dibuat", 201);
  } catch (error) {
    next(error);
  }
}
```

### Langkah 6: Hubungkan Rute (`categories.routes.ts`)
Pasang middleware `validateRequest` untuk memeriksa data masuk:
```ts
import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import * as categoriesController from "./categories.controller.js";
import { createCategorySchema } from "./categories.schema.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.post(
  "/",
  validateRequest(createCategorySchema),
  categoriesController.createCategory
);
```

### Langkah 7: Ekspor dari Modul (`index.ts`)
```ts
export { categoriesRouter } from "./categories.routes.js";
export * from "./categories.types.js";
```

### Langkah 8: Daftarkan ke Central Router (`src/routes.ts`)
Cukup tambahkan 2 baris di `backend/src/routes.ts`:
```ts
import { categoriesRouter } from "./modules/categories/index.js";

apiRouter.use("/categories", categoriesRouter);
```

---

## 4. Utilitas Bersama (Shared Utilities) yang Tersedia

### 1. `sendSuccess` & `sendError` (`src/shared/utils/apiResponse.ts`)
Pastikan setiap endpoint menghasilkan format JSON standar:
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... },
  "meta": { "total": 10 }
}
```
Atau jika gagal:
```json
{
  "success": false,
  "message": "Validasi input gagal",
  "error": [ ... ]
}
```

### 2. Validasi Otomatis dengan Zod (`src/shared/middlewares/validateRequest.ts`)
Jika payload tidak sesuai skema Zod, middleware akan otomatis menghentikan request dan mengembalikan HTTP `422 Unprocessable Entity` beserta rincian field yang salah.

### 3. Upload Gambar Multer (`src/shared/middlewares/upload.ts`)
Untuk fitur yang membutuhkan upload gambar (misalnya foto laporan):
```ts
import { uploadReportImage } from "../../shared/middlewares/upload.js";

router.post("/upload", uploadReportImage.single("image"), controller.upload);
```
- File otomatis tersimpan di folder `backend/uploads/`.
- File yang berhasil diunggah langsung dapat diakses dari browser melalui URL `/uploads/<namafile.jpg>`.
- Di mode Docker, folder ini dipetakan ke volume `uploads_data` sehingga tidak akan hilang saat container di-restart.

---

## 5. Tips Bekerja dalam Tim

1. **Satu Cabang Git per Fitur**:
   Buat branch dengan format `feat/reports`, `feat/conservation-areas`, `feat/auth`.
2. **Jangan Mengubah File Modul Lain**:
   Hindari mengimpor service modul lain secara langsung. Jika butuh data bersama, letakkan di `src/shared/`.
3. **Selalu Validasi Sebelum Commit**:
   Jalankan pemeriksaan build sebelum membuat Pull Request:
   ```bash
   docker compose build backend
   ```

