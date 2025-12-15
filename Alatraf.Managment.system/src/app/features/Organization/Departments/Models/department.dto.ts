import { SectionDto } from "../../Sections/Models/section.dto";

export interface DepartmentDto {
  id: number;
  name: string;
  sections?: SectionDto[] | null;
}
