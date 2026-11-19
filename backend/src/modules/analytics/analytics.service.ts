import type { DashboardSummary } from "./analytics.types.js";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return {
    updatedAt: "9 Oktober 2026",
    metrics: [
      { label: "Wilayah konservasi", value: "3", unit: "lokasi" },
      { label: "Total luas kawasan", value: "62,9", unit: "ribu ha" },
      { label: "Laporan bulan ini", value: "10", unit: "laporan" },
      { label: "Perlu ditinjau", value: "7", emphasis: true }
    ],
    monthlyTrend: [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 3 },
      { month: "Mar", count: 3 },
      { month: "Apr", count: 4 },
      { month: "Mei", count: 4 },
      { month: "Jun", count: 5 },
      { month: "Jul", count: 4 },
      { month: "Agu", count: 6 },
      { month: "Sep", count: 7 },
      { month: "Okt", count: 10 }
    ],
    severityComposition: [
      { level: "Kritis", count: 2, color: "#b93632" },
      { level: "Siaga", count: 5, color: "#d7662f" },
      { level: "Waspada", count: 9, color: "#c9971d" },
      { level: "Normal", count: 32, color: "#247a5e" }
    ]
  };
}

