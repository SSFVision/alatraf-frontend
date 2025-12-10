export interface UpdateIndustrialPartUnitRequest {
  unitId: number;
  price: number;
}

export interface UpdateIndustrialPartRequest {
  name: string;
  description?: string | null;
  units: UpdateIndustrialPartUnitRequest[];
}
