# Dokumentasi SIMEKA

Selamat datang di dokumentasi **SIMEKA (Sistem Pemantauan Wilayah Konservasi)**. Dokumentasi ini menjelaskan cara menyiapkan lingkungan, menjalankan layanan melalui Docker, menggunakan fitur aplikasi, serta alur kolaborasi tim pengembang.

## Daftar Panduan

1. **[Setup & Cara Menjalankan](./setup-dan-menjalankan.md)**  
   Prasyarat sistem, konfigurasi `.env`, menjalankan mode **Production** dan **Development (hot-reload)** via Docker Compose, perintah operasional harian, serta *troubleshooting*.
2. **[Panduan Penggunaan Aplikasi](./panduan-penggunaan.md)**  
   Daftar lengkap halaman & rute aplikasi (Dashboard Publik, Peta GIS, Portal Pelapor, Panel Admin), cara navigasi, dan pengujian endpoint API.
3. **[Panduan Pengembangan Fitur Backend (Team Guide)](./panduan-pengembangan-fitur.md)**  
   **Wajib dibaca oleh tim pengembang backend!** Standar struktur modul per fitur, cara menggunakan validasi Zod, upload foto Multer, format JSON `sendSuccess`/`sendError`, dan tutorial langkah-demi-langkah menambah endpoint baru tanpa *merge conflict*.
4. **[Arsitektur & Spesifikasi Sistem](./arsitektur-dan-pengembangan.md)**  
   Struktur monorepo (`frontend/`, `backend/`, `db/`), diagram komunikasi antar-container Docker, dan integrasi frontend-backend.

## Ringkasan Perintah Cepat

| Kebutuhan | Perintah | URL Utama |
| --- | --- | --- |
| Jalankan Production | `docker compose up -d --build` | `http://localhost:8080` |
| Jalankan Development (hot-reload) | `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build` | `http://localhost:4174` |
| Cek status container | `docker compose ps` | — |
| Lihat log seluruh service | `docker compose logs -f` | — |
| Hentikan semua container | `docker compose down` | — |
| Cek status API & Database | `curl http://localhost:8080/api/health` | — |
| Cek daftar endpoint modular | `curl http://localhost:8080/api` | — |
