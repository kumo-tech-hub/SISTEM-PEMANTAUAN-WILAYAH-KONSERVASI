# Arsitektur & Spesifikasi Sistem

Dokumen ini menjelaskan struktur monorepo, arsitektur backend modular berbasis fitur, dan alur komunikasi antar-service di Docker.

---

## 1. Struktur Folder Proyek

```text
SISTEM-PEMANTAUAN-WILAYAH-KONSERVASI/
├── frontend/                   # Service Frontend (React 19 + Vite 8 + TypeScript + Tailwind v4)
│   ├── public/                 # Aset publik statis
│   ├── src/
│   │   ├── components/         # Komponen UI (admin, dashboard, layout, reporter, ui)
│   │   ├── data/               # Data awal
│   │   ├── layouts/            # Layout Publik, Pelapor, Admin
│   │   ├── lib/
│   │   │   └── api.ts          # Helper pemanggilan Backend API (/api)
│   │   ├── pages/              # Halaman aplikasi
│   │   ├── App.tsx             # Konfigurasi routing React Router v7
│   │   └── types.ts            # Definisi tipe TypeScript domain SIMEKA
│   ├── nginx.conf              # Konfigurasi Nginx Production (SPA + reverse proxy /api/ & /uploads/)
│   ├── vite.config.ts          # Konfigurasi Vite + dev proxy /api & /uploads -> backend:4000
│   ├── Dockerfile              # Multi-stage Dockerfile (deps -> dev / builder -> prod Nginx)
│   └── .dockerignore
│
├── backend/                    # Service Backend (Node.js 24 + Express + TypeScript + mysql2 + zod + multer)
│   ├── src/
│   │   ├── shared/             # Lapisan bersama (Shared Kernel)
│   │   │   ├── config/         # env.ts, database.ts
│   │   │   ├── middlewares/    # errorHandler.ts, validateRequest.ts (Zod), upload.ts (Multer)
│   │   │   ├── utils/          # apiResponse.ts (sendSuccess, sendError)
│   │   │   └── types/          # common.types.ts
│   │   ├── modules/            # Modul-modul fitur terisolasi (dikerjakan per tim)
│   │   │   ├── health/         # Health check & database ping
│   │   │   ├── reports/        # Pelaporan pesisir (CRUD + foto upload + Zod)
│   │   │   ├── conservation-areas/ # Wilayah konservasi & zonasi GIS
│   │   │   ├── auth/           # Login admin & pelapor
│   │   │   ├── species/        # Observasi spesies/satwa
│   │   │   └── analytics/      # Rekap metrik ringkasan dashboard
│   │   ├── routes.ts           # Central router API (/api)
│   │   ├── app.ts              # Inisialisasi Express & middleware
│   │   └── server.ts           # Entrypoint HTTP server & graceful shutdown
│   ├── uploads/                # Direktori penyimpanan file upload (persistent via Docker volume)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile              # Multi-stage Dockerfile
│   └── .dockerignore
│
├── db/
│   └── init/
│       └── 01-init.sql         # Skrip SQL inisialisasi awal MySQL (tabel reports & seed data)
├── docs/                       # Dokumentasi proyek
│   ├── README.md
│   ├── setup-dan-menjalankan.md
│   ├── panduan-penggunaan.md
│   └── panduan-pengembangan-fitur.md # Panduan workflow tim
├── docker-compose.yml          # Orkestrasi Production
├── docker-compose.dev.yml      # Override untuk Development (hot-reload)
├── .env.example                # Template variabel lingkungan
└── README.md
```

---

## 2. Alur Komunikasi Service

### Mode Production (`docker-compose.yml`)
1. Browser mengakses `http://localhost:8080` (container **`frontend`** Nginx).
2. Request halaman SPA (`/`, `/gis`, `/pelapor/*`, `/admin/*`) disajikan langsung dari static build dengan fallback ke `/index.html`.
3. Request ke `/api/*` diteruskan oleh Nginx ke `http://backend:4000/api/*` melalui internal network `simeka-net`.
4. Request gambar bukti laporan ke `/uploads/*` diteruskan oleh Nginx ke `http://backend:4000/uploads/*`.
5. Container **`backend`** (Express) berkomunikasi ke container **`db`** (`mysql:8.4`) pada `db:3306` menggunakan `mysql2/promise` connection pool.

### Mode Development (`docker-compose.yml` + `docker-compose.dev.yml`)
1. Browser mengakses `http://localhost:4174` (Vite Dev Server).
2. `vite.config.ts` mem-proxy seluruh request `/api/*` dan `/uploads/*` ke `http://backend:4000`.
3. Folder `backend/` dan `frontend/` menggunakan *bind mount* dengan anonymous volume untuk `node_modules` sehingga setiap perubahan kode langsung aktif secara instan.
4. Port database dipetakan ke host pada `127.0.0.1:3307` sehingga developer dapat membuka DBeaver / DataGrip secara lokal.
