import type { SpeciesObservation } from "./species.types.js";

const fallbackSpecies: SpeciesObservation[] = [
  {
    id: "SP-01",
    name: "Kuntul kecil",
    scientificName: "Egretta garzetta",
    status: "Dilindungi",
    image: "/assets/DSC01043-scaled.jpg",
    lastSeenLocation: "Pesisir Latawe",
    lastSeenDate: "8 Oktober 2026"
  },
  {
    id: "SP-02",
    name: "Penyu hijau",
    scientificName: "Chelonia mydas",
    status: "Terancam",
    image: "/assets/DSC01043-scaled.jpg",
    lastSeenLocation: "Perairan Napabalano",
    lastSeenDate: "7 Oktober 2026"
  },
  {
    id: "SP-03",
    name: "Kepiting bakau",
    scientificName: "Scylla serrata",
    status: "Perhatian Khusus",
    image: "/assets/DSC01043-scaled.jpg",
    lastSeenLocation: "Batalaiworu",
    lastSeenDate: "3 Oktober 2026"
  }
];

export async function getSpeciesList(): Promise<SpeciesObservation[]> {
  return fallbackSpecies;
}

