export interface ConservationArea {
  id: string;
  name: string;
  ecosystem: string;
  condition: "Kritis" | "Siaga" | "Waspada" | "Normal";
  area: string;
  authority: string;
  description: string;
  coordinates: Array<[number, number]>;
}

export interface ConservationZone {
  id: string;
  name: string;
  areaId: string;
  color: string;
  coordinates: Array<[number, number]>;
}

