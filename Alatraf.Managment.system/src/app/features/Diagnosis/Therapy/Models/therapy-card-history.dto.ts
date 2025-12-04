

export interface TherapyCardProgramSummaryDto {
  programName: string;
  totalSessions?: number;
}

export interface TherapyCardHistoryDto {
  therapyCardId: number;         // Unique ID of card
  cardNumber: string;            // رقم الكرت
  cardDate: string | Date;       // تاريخ الكرت

  diagnosisSummary: string;      // ⭐ ملخص التشخيص
  departmentName: string;        // ⭐ القسم (العلاج الطبيعي - الأطراف ..)
  status: 'completed' | 'active' | 'stopped' | 'cancelled'; // ⭐ الحالة
  startDate: string | Date;      // ⭐ بداية البرنامج العلاجي
  endDate?: string | Date;       // تاريخ النهاية (اختياري)
  createdBy: string;             // ⭐ الطبيب/الأخصائي
  notes?: string;                // ملاحظات إضافية

  programs: TherapyCardProgramSummaryDto[];
}
 export const MOCK_THERAPY_CARD_HISTORY: TherapyCardHistoryDto[] = [
    {
      therapyCardId: 1,
      cardNumber: '784512369',
      cardDate: '2023-02-05',
      diagnosisSummary: 'تمزق عضلي في الكتف الأيمن',
      departmentName: 'العلاج الطبيعي',
      status: 'completed',
      startDate: '2023-02-05',
      endDate: '2023-03-01',
      createdBy: 'د. محمد بن يوسف',
      notes: 'استجابة جيدة للعلاج',

      programs: [
        { programName: 'تدليك', totalSessions: 3 },
        { programName: 'كهرباء', totalSessions: 2 },
      ],
    },

    {
      therapyCardId: 2,
      cardNumber: '995412887',
      cardDate: '2023-03-18',

      diagnosisSummary: 'إلتهاب أوتار الرسغ',
      departmentName: 'العلاج الطبيعي',
      status: 'active',
      startDate: '2023-03-18',
      createdBy: 'أ. علي المصراتي',

      programs: [
        { programName: 'تمارين علاجية', totalSessions: 5 },
        { programName: 'تدليك' },
      ],
    },

    {
      therapyCardId: 3,
      cardNumber: '773641920',
      cardDate: '2023-05-10',

      diagnosisSummary: 'إصابة أعصاب الأطراف السفلية',
      departmentName: 'الأعصاب',
      status: 'stopped',
      startDate: '2023-05-10',
      endDate: '2023-05-20',
      createdBy: 'د. سامي البوعيشي',
      notes: 'تم إيقاف الجلسات بطلب من المريض',

      programs: [{ programName: 'تحفيز كهربائي', totalSessions: 4 }],
    },

    {
      therapyCardId: 4,
      cardNumber: '661239874',
      cardDate: '2023-06-01',

      diagnosisSummary: 'بتر أسفل الركبة – تجهيز طرف صناعي',
      departmentName: 'الأطراف الصناعية',
      status: 'active',
      startDate: '2023-06-01',
      createdBy: 'م. عبدالسلام خليفة',

      programs: [
        { programName: 'قياس وصب الطبعة' },
        { programName: 'تركيب أولي للطرف' },
      ],
    },
  ];
