// Industrial Part Unit (child table)
export interface MockIndustrialPartUnitDto {
  industrialPartUnitId: number; // PK
  unitId: number;               // logical unit (size, type, etc.)
  unitName: string;
  pricePerUnit: number;
}

// Industrial Part (parent table)
export interface MockIndustrialPartDto {
  industrialPartId: number;  // PK
  name: string;
  description?: string;
  units: MockIndustrialPartUnitDto[];
}
