

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
