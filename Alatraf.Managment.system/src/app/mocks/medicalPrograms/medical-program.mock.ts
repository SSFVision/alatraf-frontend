// src/app/mocks/medicalPrograms/medical-program.mock.ts

export interface MedicalProgramDto {
  Id: number;
  Name: string;
  Description?: string | null;
}

export const MEDICAL_PROGRAMS_MOCK_DATA: MedicalProgramDto[] = [
  {
    Id: 1,
    Name: 'برنامج تقوية العضلات',
    Description: 'تمارين موجهة لزيادة قوة العضلات وتحسين القدرة الوظيفية.',
  },
  {
    Id: 2,
    Name: 'برنامج تمارين الإطالة',
    Description: 'برنامج لتحسين المرونة ونطاق الحركة للمفاصل والعضلات.',
  },
  {
    Id: 3,
    Name: 'برنامج التأهيل بعد العمليات',
    Description: 'برنامج لإعادة التأهيل بعد العمليات الجراحية (ركبة، كتف، عمود فقري...).',
  },
  {
    Id: 4,
    Name: 'برنامج علاج آلام أسفل الظهر',
    Description: 'برنامج مخصص لعلاج آلام أسفل الظهر المزمنة والحادة.',
  },
  {
    Id: 5,
    Name: 'برنامج تأهيل إصابات الرياضيين',
    Description: 'برنامج مخصص للعلاج والعودة الآمنة للرياضة بعد الإصابات.',
  },
];
