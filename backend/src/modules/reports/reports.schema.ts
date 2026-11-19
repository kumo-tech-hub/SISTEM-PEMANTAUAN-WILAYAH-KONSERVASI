import { z } from "zod";

const severityEnum = z.enum(["Kritis", "Siaga", "Waspada", "Normal"], {
  errorMap: () => ({ message: "Tingkat keparahan harus Kritis, Siaga, Waspada, atau Normal" })
});

const reviewStatusEnum = z.enum(
  ["Belum ditinjau admin", "Laporan masyarakat", "Telah ditinjau", "Perlu diperbaiki"],
  {
    errorMap: () => ({ message: "Status peninjauan tidak valid" })
  }
);

export const createReportSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Judul laporan minimal 3 karakter"),
    category: z.string().min(2, "Kategori wajib dipilih"),
    ecosystem: z.string().min(2, "Ekosistem wajib dipilih"),
    location: z.string().min(3, "Nama lokasi wajib diisi"),
    region: z.string().min(2, "Wilayah/Kecamatan wajib dipilih"),
    severity: severityEnum.default("Waspada"),
    description: z.string().min(10, "Deskripsi kejadian minimal 10 karakter"),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional()
  })
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID laporan wajib disertakan")
  }),
  body: z.object({
    reviewStatus: reviewStatusEnum,
    adminNote: z.string().max(500, "Catatan admin maksimal 500 karakter").optional()
  })
});

export const getReportsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    region: z.string().optional(),
    severity: z.string().optional(),
    status: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  })
});

