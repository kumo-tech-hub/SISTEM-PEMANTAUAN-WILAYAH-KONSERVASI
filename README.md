# SIMEKA — Sistem Pemantauan Wilayah Konservasi

Aplikasi web pemantauan wilayah konservasi pesisir Kabupaten Muna dengan arsitektur terpisah antara **Frontend** (React + Vite + TypeScript + Tailwind CSS + Leaflet + Chart.js), **Backend** (Node.js + Express + TypeScript), dan **Database** (MySQL 8.4) yang dibungkus menggunakan Docker Compose.

## Struktur Proyek

- `frontend/` — Aplikasi SPA React (Dashboard Publik, GIS, Portal Pelapor, Panel Admin) + Nginx reverse proxy untuk production.
- `backend/` — Starter REST API berbasis Express + TypeScript + `mysql2` pool.
- `db/init/` — Skrip SQL inisialisasi awal MySQL.
- `docs/` — Dokumentasi lengkap cara instalasi, menjalankan, menggunakan, dan mengembangkan proyek.

## Quick Start dengan Docker

Salin konfigurasi environment (jika belum ada `.env`):

```bash
cp .env.example .env
```

### Mode Production (Nginx + Backend + MySQL)

```bash
docker compose up -d --build
```

Akses aplikasi di `http://localhost:8080` dan cek status API di `http://localhost:8080/api/health`.

### Mode Development (Hot-Reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Frontend (Vite HMR): `http://localhost:4174`
- Backend API (`tsx watch`): `http://localhost:4000/api/health`
- MySQL lokal: `127.0.0.1:3307` (port 3307 agar tidak bentrok dengan MySQL bawaan host)

## Dokumentasi Lengkap

Lihat folder [`docs/`](./docs/README.md):
- [Setup & Cara Menjalankan](./docs/setup-dan-menjalankan.md)
- [Panduan Penggunaan Aplikasi](./docs/panduan-penggunaan.md)
- [Arsitektur & Panduan Pengembangan](./docs/arsitektur-dan-pengembangan.md)
