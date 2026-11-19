import type {
  ConservationArea,
  ConservationZone
} from "./conservation-areas.types.js";

const fallbackAreas: ConservationArea[] = [
  {
    id: "KA-01",
    name: "Kawasan Konservasi Pesisir Latawe",
    ecosystem: "Mangrove & Muara",
    condition: "Kritis",
    area: "14,2 ribu ha",
    authority: "KKP / BPSPL Makassar",
    description: "Zona penyangga mangrove dengan tekanan pemanfaatan kayu dan tambak liar.",
    coordinates: [
      [-4.75, 122.39],
      [-4.75, 122.44],
      [-4.79, 122.44],
      [-4.79, 122.39]
    ]
  },
  {
    id: "KA-02",
    name: "Taman Pesisir Napabalano",
    ecosystem: "Terumbu Karang",
    condition: "Siaga",
    area: "28,4 ribu ha",
    authority: "DKP Kabupaten Muna",
    description: "Gugusan karang tepi dan habitat penyu hijau yang memerlukan pengawasan patroli.",
    coordinates: [
      [-4.6, 122.65],
      [-4.6, 122.72],
      [-4.66, 122.72],
      [-4.66, 122.65]
    ]
  },
  {
    id: "KA-03",
    name: "Kawasan Suaka Perairan Teluk Lasalepa",
    ecosystem: "Padang Lamun",
    condition: "Waspada",
    area: "20,3 ribu ha",
    authority: "Pokmaswas Lasalepa",
    description: "Kawasan padang lamun produktif dengan sedimentasi musiman.",
    coordinates: [
      [-4.71, 122.75],
      [-4.71, 122.81],
      [-4.76, 122.81],
      [-4.76, 122.75]
    ]
  }
];

const fallbackZones: ConservationZone[] = [
  {
    id: "Z-01",
    name: "Zona Inti Latawe",
    areaId: "KA-01",
    color: "#b93632",
    coordinates: [
      [-4.76, 122.4],
      [-4.76, 122.43],
      [-4.78, 122.43],
      [-4.78, 122.4]
    ]
  },
  {
    id: "Z-02",
    name: "Zona Pemanfaatan Terbatas Napabalano",
    areaId: "KA-02",
    color: "#d7662f",
    coordinates: [
      [-4.61, 122.66],
      [-4.61, 122.71],
      [-4.65, 122.71],
      [-4.65, 122.66]
    ]
  }
];

export async function getConservationAreas(): Promise<ConservationArea[]> {
  return fallbackAreas;
}

export async function getConservationZones(): Promise<ConservationZone[]> {
  return fallbackZones;
}

export async function getConservationAreaById(id: string): Promise<ConservationArea | null> {
  const found = fallbackAreas.find((a) => a.id === id);
  return found ?? null;
}

