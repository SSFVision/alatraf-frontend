export enum PatientCardType {
  Disabled = 'DISABLED',
  Wounded = 'WOUNDED',
}

export const PatientCardTypeLabel: Record<PatientCardType, string> = {
  [PatientCardType.Disabled]: 'المعاقين',
  [PatientCardType.Wounded]: 'الجرحى',
};
