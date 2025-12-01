import { IndustrialPartUnitDto } from "./industrial-part-unit.dto";

export interface IndustrialPartDto {
  Id: number;
  Name: string;
  Description?: string;
  Units: IndustrialPartUnitDto[];
}
