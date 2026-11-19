# Panduan Penggunaan Aplikasi SIMEKA

SIMEKA terdiri dari **tiga area antarmuka web** (Publik, Pelapor, dan Admin) serta **layanan Backend API** yang siap dikembangkan.

> **Catatan port URL:**  
> - Pada mode **Production**, gunakan base URL `http://localhost:8080`.  
> - Pada mode **Development**, gunakan base URL `http://localhost:4174`.

---

## 1. Akun Default untuk Login

Database MySQL telah di-seed dengan dua akun default untuk pengujian:

| Peran (Role) | Email | Password | Keterangan |
| --- | --- | --- | --- |
| **Admin KKP** | `admin@kkp.go.id` | `admin123` | Akses penuh ke panel admin & peninjauan laporan |
| **Pelapor Pesisir** | `pelapor@kkp.go.id` | `pelapor123` | Mengirim laporan & melihat riwayat laporan sendiri |

---

## 2. Peta Rute Antarmuka Frontend

### A. Portal Publik
Dapat diakses langsung tanpa login:

| Rute | Halaman | Fungsi Utama |
| --- | --- | --- |
| `/` | Dashboard Publik | Ringkasan kondisi kawasan konservasi, grafik tren laporan bulanan & komposisi tingkat keparahan (Chart.js), daftar laporan terbaru, dan observasi spesies utama. |
| `/gis` | Peta GIS Interaktif | Eksplorasi peta wilayah konservasi & zonasi (Leaflet + MarkerCluster), filter berdasarkan kategori/ekosistem/tingkat keparahan, pergantian basemap (OSM / Citra Satelit Esri), dan detail titik laporan. |

### B. Portal Pelapor (`/pelapor`)
Digunakan oleh masyarakat/pelapor lapangan untuk mengirimkan laporan kondisi pesisir:

| Rute | Halaman | Fungsi Utama |
| --- | --- | --- |
| `/pelapor/login` | Login Pelapor | Halaman masuk pelapor (Gunakan email `pelapor@kkp.go.id` dan password `pelapor123` atau akun baru hasil registrasi). |
| `/pelapor` atau `/pelapor/buat-laporan` | Buat Laporan | Formulir pelaporan baru (kategori kejadian, lokasi, koordinat, deskripsi, dan unggah foto bukti). |
| `/pelapor/riwayat` | Riwayat Laporan | Melihat daftar laporan yang pernah dikirim beserta status peninjauan (`Laporan masyarakat`, `Telah ditinjau`, `Perlu diperbaiki`). |
| `/pelapor/riwayat/:id` | Detail Laporan | Melihat rincian laporan tertentu dan catatan dari Admin. |

### C. Panel Admin (`/admin`)
Digunakan oleh pengelola kawasan konservasi (KKP) untuk memantau dan meninjau laporan:

| Rute | Halaman | Fungsi Utama |
| --- | --- | --- |
| `/admin/login` | Login Admin | Masuk ke panel admin menggunakan email `admin@kkp.go.id` dan password `admin123`. |
| `/admin` | Dashboard Admin | Metrik ringkasan wilayah konservasi, tren laporan, dan daftar laporan terbaru yang perlu ditinjau. |
| `/admin/laporan` | Manajemen Laporan | Daftar seluruh laporan masuk untuk difilter dan ditindaklanjuti. |
| `/admin/laporan/:id` | Detail & Tinjau Laporan | Meninjau detail laporan, mengubah status, atau memberikan catatan tindak lanjut. |
| `/admin/wilayah` | Manajemen Wilayah | Pengelolaan data wilayah dan zona konservasi. |
| `/admin/kategori` | Manajemen Kategori | Pengelolaan kategori ancaman/observasi pelaporan. |

---

## 3. Dokumentasi Endpoint Autentikasi (`/api/auth`)

### 1. Login Umum (`POST /api/auth/login`)
Menerima login untuk peran apa pun (admin maupun pelapor).

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kkp.go.id","password":"admin123"}'
```

**Respon Sukses (HTTP 200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "USR-ADM-01",
      "name": "Admin KKP Muna",
      "email": "admin@kkp.go.id",
      "role": "admin",
      "agency": "DKP Kabupaten Muna / BPSPL Makassar",
      "phone": "081234567890",
      "avatarUrl": null,
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### 2. Login Khusus Admin (`POST /api/auth/admin/login`)
Hanya mengizinkan login jika user memiliki `role === 'admin'`. Jika pelapor mencoba login di sini, akan ditolak (`401: Akun ini tidak memiliki hak akses sebagai admin`).

### 3. Login Khusus Pelapor (`POST /api/auth/reporter/login`)
Hanya mengizinkan login jika user memiliki `role === 'reporter'`.

### 4. Registrasi Pengguna Baru (`POST /api/auth/register`)
Mendaftarkan akun pelapor baru ke database MySQL:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Budi Santoso",
    "email": "budi@gmail.com",
    "password": "password123",
    "agency": "Pokmaswas Napabalano",
    "phone": "081233445566"
  }'
```

### 5. Profil Pengguna yang Sedang Login (`GET /api/auth/me`)
Memeriksa data user berdasarkan Bearer token JWT di header:

```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <TOKEN_JWT_DARI_LOGIN>"
```
