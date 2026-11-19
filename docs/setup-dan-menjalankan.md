# Setup & Cara Menjalankan Proyek

Panduan ini mencakup langkah lengkap untuk menjalankan SIMEKA menggunakan **Docker Compose** (disarankan) maupun secara lokal tanpa Docker.

---

## 1. Prasyarat

- **Docker Engine** & **Docker Compose** v2+ (`docker compose version`)
- *(Opsional, jika menjalankan tanpa Docker)* **Node.js 22/24+** dan server **MySQL 8.4** atau **MariaDB 11**

Periksa instalasi Docker:

```bash
docker --version
docker compose version
```

---

## 2. Konfigurasi Variabel Lingkungan (`.env`)

Salin file contoh `.env.example` menjadi `.env` di root repositori (jika belum ada):

```bash
cp .env.example .env
```

Variabel yang tersedia di `.env`:

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `FRONTEND_PORT` | `8080` | Port host untuk frontend Nginx pada mode **Production** |
| `FRONTEND_DEV_PORT` | `4174` | Port host untuk Vite Dev Server pada mode **Development** |
| `BACKEND_PORT` | `4000` | Port host untuk API Backend pada mode **Development** |
| `DB_PORT` | `3307` | Port host lokal (`127.0.0.1`) untuk MySQL pada mode **Development** (menggunakan 3307 agar tidak bentrok dengan daemon MySQL bawaan host) |
| `DB_NAME` | `simeka_db` | Nama database MySQL |
| `DB_USER` | `simeka` | Username database aplikasi |
| `DB_PASSWORD` | `simeka_secret` | Password user database aplikasi |
| `DB_ROOT_PASSWORD` | `simeka_root_secret` | Password root MySQL |
| `CORS_ORIGIN` | `http://localhost:8080` | Daftar origin yang diizinkan di mode **Production** (pisahkan dengan koma) |
| `CORS_ORIGIN_DEV` | `http://localhost:4174,http://localhost:8080` | Daftar origin yang diizinkan di mode **Development** |

> **Catatan keamanan:** File `.env` sudah masuk `.gitignore`. Untuk deployment server produksi, pastikan mengganti `DB_PASSWORD`, `DB_ROOT_PASSWORD`, dan `CORS_ORIGIN` sesuai domain Anda.

---

## 3. Menjalankan Mode Production (Nginx + Backend + MySQL)

Mode ini mem-build bundle statis React dan menyajikannya melalui **Nginx**, yang sekaligus meneruskan request `/api/*` ke container **backend**. Port MySQL dan backend tidak diekspos langsung ke host demi keamanan.

```bash
docker compose up -d --build
```

Verifikasi seluruh service berstatus `healthy`:

```bash
docker compose ps
```

Akses layanan:
- **Aplikasi Web (Frontend):** `http://localhost:8080`
- **Health Check Backend + DB (via Nginx proxy):** `http://localhost:8080/api/health`
- **Info API:** `http://localhost:8080/api`

Menghentikan mode production:

```bash
docker compose down
```

---

## 4. Menjalankan Mode Development (Hot-Reload)

Mode ini menggabungkan `docker-compose.yml` dengan override `docker-compose.dev.yml`. Kode di `frontend/` dan `backend/` di-mount langsung ke dalam container sehingga perubahan file otomatis me-reload Vite (HMR) dan Express (`tsx watch`).

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Untuk berjalan di background:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Akses layanan saat development:
- **Frontend (Vite HMR):** `http://localhost:4174`
- **Proxy API lewat Vite:** `http://localhost:4174/api/health`
- **Backend langsung:** `http://localhost:4000/api/health`
- **MySQL (via DBeaver / DataGrip / CLI):** `127.0.0.1:3307` dengan kredensial dari `.env`

Menghentikan mode development:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

---

## 5. Perintah Operasional Docker Harian

- **Melihat log real-time semua service:**
  ```bash
  docker compose logs -f
  ```
- **Melihat log service tertentu (`frontend`, `backend`, atau `db`):**
  ```bash
  docker compose logs -f backend
  ```
- **Rebuild ulang setelah menambah package npm di `frontend/` atau `backend/`:**
  ```bash
  # Mode development
  docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --renew-anon-volumes

  # Mode production
  docker compose up -d --build
  ```
- **Masuk ke shell MySQL di dalam container:**
  ```bash
  docker compose exec db mysql -u simeka -psimeka_secret simeka_db
  ```
- **Reset total database (HAPUS seluruh data volume MySQL dan jalankan ulang `db/init/`):**
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```

---

## 6. Menjalankan Lokal Tanpa Docker (Opsional)

Jika ingin menjalankan langsung di mesin host tanpa container:

1. Pastikan MySQL berjalan dan buat database `simeka_db`, lalu buat file `backend/.env` dengan `DB_HOST=127.0.0.1` dan kredensial MySQL Anda.
2. Jalankan backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Di terminal lain, jalankan frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend akan tersedia di `http://localhost:4174` dan otomatis mem-proxy `/api` ke `http://localhost:4000`.

---

## 7. Troubleshooting

### Port sudah digunakan (`address already in use`)
Ubah port di file `.env` (misalnya `FRONTEND_PORT=8081`, `BACKEND_PORT=4001`, atau `DB_PORT=3307`), lalu jalankan ulang `docker compose up -d`.

### Backend gagal start atau status `/api/health` mengembalikan `503`
- Periksa apakah container `db` sudah `healthy` dengan `docker compose ps`.
- Jika Anda mengubah `DB_USER` atau `DB_PASSWORD` di `.env` setelah volume MySQL pernah dibuat, MySQL tidak otomatis mengubah password pada volume lama. Hapus volume lama dengan `docker compose down -v` lalu jalankan kembali.

### Perubahan package di `package.json` tidak terbaca di mode Development
Karena `node_modules` disimpan pada *anonymous volume* agar tidak tertimpa oleh host, jalankan rebuild dengan `--renew-anon-volumes`:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --renew-anon-volumes
```

