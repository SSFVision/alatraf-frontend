export interface IndustrialPartUnitDto {
  industrialPartUnitId: number;
  unitId: number;
  unitName: string;
  pricePerUnit: number; // decimal → number
}

export interface IndustrialPartDto {
  industrialPartId: number;
  name: string;
  description?: string | null;
  industrialPartUnits: IndustrialPartUnitDto[];
}
