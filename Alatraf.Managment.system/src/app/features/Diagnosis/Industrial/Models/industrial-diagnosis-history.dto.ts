// industrial-diagnosis-history.dto.ts

export interface IndustrialDiagnosisPartSummaryDto {
  partName: string;       // e.g., "قدم يسرى", "عكاز"
  quantity?: number;      // optional quantity
  unitName?: string;      // e.g., "حبة", "زوج"
}

export interface IndustrialDiagnosisHistoryDto {
  diagnosisId: number;      // unique ID
  cardNumber: string;       // رقم الكرت
  date: string | Date;      // تاريخ الكرت

  parts: IndustrialDiagnosisPartSummaryDto[]; // list of parts used

  createdBy?: string;       // optional - doctor name
  notes?: string;           // optional - any notes
}
export const MOCK_INDUSTRIAL_DIAGNOSIS_HISTORY: IndustrialDiagnosisHistoryDto[] = [
  {
    diagnosisId: 1,
    cardNumber: '784512369',
    date: '2023-02-05',
    parts: [
      { partName: 'قدم يسرى' },
      { partName: 'عكاز' }
    ]
  },
    {
    diagnosisId: 2,
    cardNumber: 'Waleed Alhakimi',
    date: '2023-02-05',
    parts: [
      { partName: 'قدم يسرى' },
      { partName: 'عكاز' }
    ]
  },
  {
    diagnosisId: 3,
    cardNumber: '995411258',
    date: '2023-03-12',
    parts: [
      { partName: 'ركبة صناعية' },
      { partName: 'بطانة سيليكون', quantity: 1 }
    ]
  }
];
