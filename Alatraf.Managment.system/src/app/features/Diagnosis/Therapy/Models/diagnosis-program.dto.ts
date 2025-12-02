export interface DiagnosisProgramDto {
  DiagnosisProgramId: number;
  MedicalProgramId: number;
  ProgramName: string;
  Duration: number;
  Notes?: string | null;
}
