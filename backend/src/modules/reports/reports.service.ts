import type { RowDataPacket } from "mysql2";
import { dbPool } from "../../shared/config/database.js";
import type {
  CreateReportInput,
  ReportItem,
  UpdateReportStatusInput
} from "./reports.types.js";

// Data fallback jika tabel reports belum dibuat atau kosong
const fallbackReports: ReportItem[] = [
  {
    id: "RPT-026",
    title: "Penebangan mangrove",
    category: "Ancaman",
    ecosystem: "Mangrove",
    location: "Pesisir Latawe",
    region: "Tiworo Utara",
    severity: "Kritis",
    reviewStatus: "Belum ditinjau admin",
    date: "8 Oktober 2026",
    description: "Beberapa batang baru ditebang dan material masih berada di lokasi.",
    image: "/assets/DSC01043-scaled.jpg",
    lat: -4.769,
    lng: 122.418,
    createdAt: new Date("2026-10-08T09:00:00Z").toISOString()
  },
  {
    id: "RPT-025",
    title: "Pemutihan karang",
    category: "Kondisi ekosistem",
    ecosystem: "Terumbu karang",
    location: "Perairan Napabalano",
    region: "Napabalano",
    severity: "Siaga",
    reviewStatus: "Telah ditinjau",
    date: "7 Oktober 2026",
    description: "Warna memucat terlihat pada sebagian koloni di titik pengamatan.",
    image: "/assets/DSC01043-scaled.jpg",
    lat: -4.624,
    lng: 122.697,
    createdAt: new Date("2026-10-07T14:30:00Z").toISOString()
  },
  {
    id: "RPT-024",
    title: "Sampah di padang lamun",
    category: "Ancaman",
    ecosystem: "Padang lamun",
    location: "Teluk Lasalepa",
    region: "Lasalepa",
    severity: "Waspada",
    reviewStatus: "Telah ditinjau",
    date: "5 Oktober 2026",
    description: "Sampah plastik terdampar pada bagian dangkal ketika air surut.",
    image: "/assets/DSC01043-scaled.jpg",
    lat: -4.744,
    lng: 122.788,
    createdAt: new Date("2026-10-05T08:15:00Z").toISOString()
  }
];

export async function getAllReports(filter?: {
  category?: string;
  region?: string;
  severity?: string;
  status?: string;
  search?: string;
}): Promise<ReportItem[]> {
  try {
    let sql = "SELECT * FROM reports WHERE 1=1";
    const params: unknown[] = [];

    if (filter?.category) {
      sql += " AND category = ?";
      params.push(filter.category);
    }
    if (filter?.region) {
      sql += " AND region = ?";
      params.push(filter.region);
    }
    if (filter?.severity) {
      sql += " AND severity = ?";
      params.push(filter.severity);
    }
    if (filter?.status) {
      sql += " AND review_status = ?";
      params.push(filter.status);
    }
    if (filter?.search) {
      sql += " AND (title LIKE ? OR description LIKE ? OR location LIKE ?)";
      const pattern = `%${filter.search}%`;
      params.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await dbPool.query<RowDataPacket[]>(sql, params);
    if (!rows || rows.length === 0) {
      return fallbackReports;
    }

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      ecosystem: r.ecosystem,
      location: r.location,
      region: r.region,
      severity: r.severity,
      reviewStatus: r.review_status,
      date: r.date_formatted ?? new Date(r.created_at).toLocaleDateString("id-ID"),
      description: r.description,
      image: r.image_url ?? "/assets/DSC01043-scaled.jpg",
      lat: r.lat ? Number(r.lat) : null,
      lng: r.lng ? Number(r.lng) : null,
      adminNote: r.admin_note,
      createdAt: new Date(r.created_at).toISOString()
    }));
  } catch {
    return fallbackReports;
  }
}

export async function getReportById(id: string): Promise<ReportItem | null> {
  try {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      "SELECT * FROM reports WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        ecosystem: r.ecosystem,
        location: r.location,
        region: r.region,
        severity: r.severity,
        reviewStatus: r.review_status,
        date: r.date_formatted ?? new Date(r.created_at).toLocaleDateString("id-ID"),
        description: r.description,
        image: r.image_url ?? "/assets/DSC01043-scaled.jpg",
        lat: r.lat ? Number(r.lat) : null,
        lng: r.lng ? Number(r.lng) : null,
        adminNote: r.admin_note,
        createdAt: new Date(r.created_at).toISOString()
      };
    }
  } catch {
    // fallback
  }

  const found = fallbackReports.find((item) => item.id === id);
  return found ?? null;
}

export async function createReport(
  input: CreateReportInput,
  imageUrl?: string
): Promise<ReportItem> {
  const generatedId = `LAP-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const newReport: ReportItem = {
    id: generatedId,
    title: input.title,
    category: input.category,
    ecosystem: input.ecosystem,
    location: input.location,
    region: input.region,
    severity: input.severity,
    reviewStatus: "Laporan masyarakat",
    date: dateStr,
    description: input.description,
    image: imageUrl ?? "/assets/DSC01043-scaled.jpg",
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    createdAt: now.toISOString()
  };

  try {
    await dbPool.query(
      `INSERT INTO reports (id, title, category, ecosystem, location, region, severity, review_status, date_formatted, description, image_url, lat, lng, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newReport.id,
        newReport.title,
        newReport.category,
        newReport.ecosystem,
        newReport.location,
        newReport.region,
        newReport.severity,
        newReport.reviewStatus,
        newReport.date,
        newReport.description,
        newReport.image,
        newReport.lat,
        newReport.lng,
        now
      ]
    );
  } catch {
    // Jika tabel belum di-migrate, simpan ke memori fallback
    fallbackReports.unshift(newReport);
  }

  return newReport;
}

export async function updateReportStatus(
  id: string,
  input: UpdateReportStatusInput
): Promise<ReportItem | null> {
  try {
    await dbPool.query(
      "UPDATE reports SET review_status = ?, admin_note = ? WHERE id = ?",
      [input.reviewStatus, input.adminNote ?? null, id]
    );
  } catch {
    // fallback
  }

  const report = await getReportById(id);
  if (report) {
    report.reviewStatus = input.reviewStatus;
    report.adminNote = input.adminNote ?? report.adminNote;
  }
  return report;
}

