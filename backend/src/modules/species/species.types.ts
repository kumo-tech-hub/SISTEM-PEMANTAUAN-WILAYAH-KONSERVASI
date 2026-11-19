export interface SpeciesObservation {
  id: string;
  name: string;
  scientificName?: string;
  status: "Dilindungi" | "Terancam" | "Perhatian Khusus";
  image: string;
  lastSeenLocation: string;
  lastSeenDate: string;
}

