
export interface TherapyProgramRowDto {
  programId: number | null;
  duration: number | null;
  notes: string | null;
}

export interface TherapyDiagnosisFormDto {
  injurySide: string;
  injuryType: string;
  injuryDate: string;
  injuryAge: string;
  department: string;
  diagnosis: string;
  endDate?: string;
  duration?: string;

  programs: TherapyProgramRowDto[];
}
