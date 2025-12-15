export interface MedicalProgramDto {
  id: number;
  name: string;
  description?: string | null;
  sectionId?: number | null;
  sectionName?: string ;
}