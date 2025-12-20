export enum PatientCardType {
  Disabled = 'DISABLED',
  Wounded = 'WOUNDED',
}

export const PatientCardTypeLabel: Record<PatientCardType, string> = {
  [PatientCardType.Disabled]: 'صندوق المعاقين',
  [PatientCardType.Wounded]: 'صندوق الجرحى',
};
