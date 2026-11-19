export type Severity = "Kritis" | "Siaga" | "Waspada" | "Normal";

export type ReviewStatus =
  | "Belum ditinjau admin"
  | "Laporan masyarakat"
  | "Telah ditinjau"
  | "Perlu diperbaiki";

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  ecosystem: string;
  location: string;
  region: string;
  severity: Severity;
  reviewStatus: ReviewStatus;
  date: string;
  description: string;
  image: string;
  imagePosition?: string;
  lat?: number | null;
  lng?: number | null;
  adminNote?: string | null;
  createdAt: string;
}

export interface CreateReportInput {
  title: string;
  category: string;
  ecosystem: string;
  location: string;
  region: string;
  severity: Severity;
  description: string;
  image?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateReportStatusInput {
  reviewStatus: ReviewStatus;
  adminNote?: string;
}

