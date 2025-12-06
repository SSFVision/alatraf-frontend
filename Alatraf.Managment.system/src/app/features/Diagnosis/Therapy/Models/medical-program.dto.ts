import { InjuryDto } from "../../Shared/Models/injury.dto";
import { TherapyCardType } from "./create-therapy-card.request";

export interface MedicalProgramDto {
  Id: number;
  Name: string;
  Description?: string | null;
  SectionId?: number | null;
}



export const INJURY_REASONS: InjuryDto[] = [
  { Id: 1, Name: 'سقوط' },
  { Id: 2, Name: 'حادث سير' },
  { Id: 3, Name: 'إلتواء' },
  { Id: 4, Name: 'كسر قديم' },
  { Id: 5, Name: 'إجهاد عضلي' },
  { Id: 6, Name: 'إصابة رياضية' },
  { Id: 7, Name: 'عمل متكرر / إجهاد وظيفي' },
];

/* ---------------------------------------
   INJURY SIDES
----------------------------------------*/
export const INJURY_SIDES: InjuryDto[] = [
  { Id: 1, Name: 'علوي أيمن' },
  { Id: 2, Name: 'علوي أيسر' },
  { Id: 3, Name: 'سفلي أيمن' },
  { Id: 4, Name: 'سفلي أيسر' },
];

/* ---------------------------------------
   INJURY TYPES
----------------------------------------*/
export const INJURY_TYPES: InjuryDto[] = [
  { Id: 1, Name: 'عضلي' },
  { Id: 2, Name: 'عظمي' },
  { Id: 3, Name: 'أعصاب' },
  { Id: 4, Name: 'أربطة / أوتار' },
];

/* ---------------------------------------
   THERAPY CARD TYPES (ENUM DROPDOWN)
----------------------------------------*/
export const THERAPY_CARD_TYPE_OPTIONS = [
  { label: 'عام', value: TherapyCardType.General },
  { label: 'خاص', value: TherapyCardType.Special },
  { label: 'أعصاب أطفال', value: TherapyCardType.NerveKids },
];

/* ---------------------------------------
   TEMPORARY HARD-CODED MEDICAL PROGRAM LIST
----------------------------------------*/
export const MEDICAL_PROGRAMS_MOCK: MedicalProgramDto[] = [
  { Id: 1, Name: 'تدليك', Description: null, SectionId: null },
  { Id: 2, Name: 'علاج كهربائي', Description: null, SectionId: null },
  { Id: 3, Name: 'تمارين علاجية', Description: null, SectionId: null },
  { Id: 4, Name: 'موجات فوق صوتية', Description: null, SectionId: null },
];