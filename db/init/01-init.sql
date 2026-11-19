-- Inisialisasi database SIMEKA
-- Dijalankan otomatis saat container MySQL pertama kali dibuat

ALTER DATABASE simeka_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE simeka_db;

-- 1. Tabel Pengguna (Users) untuk Autentikasi Admin & Pelapor
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reporter') NOT NULL DEFAULT 'reporter',
  agency VARCHAR(150) NULL,
  phone VARCHAR(50) NULL,
  avatar_url VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Laporan Pesisir (Reports)
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  ecosystem VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  severity ENUM('Kritis', 'Siaga', 'Waspada', 'Normal') NOT NULL DEFAULT 'Waspada',
  review_status ENUM('Belum ditinjau admin', 'Laporan masyarakat', 'Telah ditinjau', 'Perlu diperbaiki') NOT NULL DEFAULT 'Laporan masyarakat',
  date_formatted VARCHAR(100),
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  lat DECIMAL(10, 7) NULL,
  lng DECIMAL(10, 7) NULL,
  admin_note TEXT NULL,
  created_by VARCHAR(64) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reports_category (category),
  INDEX idx_reports_region (region),
  INDEX idx_reports_severity (severity),
  INDEX idx_reports_review_status (review_status),
  CONSTRAINT fk_reports_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data awal laporan
INSERT IGNORE INTO reports (id, title, category, ecosystem, location, region, severity, review_status, date_formatted, description, image_url, lat, lng, created_at)
VALUES
  ('RPT-026', 'Penebangan mangrove', 'Ancaman', 'Mangrove', 'Pesisir Latawe', 'Tiworo Utara', 'Kritis', 'Belum ditinjau admin', '8 Oktober 2026', 'Beberapa batang baru ditebang dan material masih berada di lokasi.', '/assets/DSC01043-scaled.jpg', -4.769, 122.418, '2026-10-08 09:00:00'),
  ('RPT-025', 'Pemutihan karang', 'Kondisi ekosistem', 'Terumbu karang', 'Perairan Napabalano', 'Napabalano', 'Siaga', 'Telah ditinjau', '7 Oktober 2026', 'Warna memucat terlihat pada sebagian koloni di titik pengamatan.', '/assets/DSC01043-scaled.jpg', -4.624, 122.697, '2026-10-07 14:30:00'),
  ('RPT-024', 'Sampah di padang lamun', 'Ancaman', 'Padang lamun', 'Teluk Lasalepa', 'Lasalepa', 'Waspada', 'Telah ditinjau', '5 Oktober 2026', 'Sampah plastik terdampar pada bagian dangkal ketika air surut.', '/assets/DSC01043-scaled.jpg', -4.744, 122.788, '2026-10-05 08:15:00'),
  ('RPT-023', 'Regenerasi mangrove', 'Pemulihan', 'Mangrove', 'Batalaiworu', 'Batalaiworu', 'Normal', 'Telah ditinjau', '3 Oktober 2026', 'Anakan baru tercatat pada area saluran pasang surut yang dipulihkan.', '/assets/DSC01043-scaled.jpg', -4.833, 122.716, '2026-10-03 11:00:00');
