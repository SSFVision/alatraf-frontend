export interface CreateIndustrialPartUnitRequest {
  unitId: number;
  price: number; // decimal → number
}

export interface CreateIndustrialPartRequest {
  name: string;
  description?: string | null;
  units: CreateIndustrialPartUnitRequest[];
}
