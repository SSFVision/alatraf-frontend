import { AppointmentStatus } from '../Models/appointment-status.enum';

export function getAppointmentStatusLabelFromEnumToArabic(
  status: AppointmentStatus | number | string
): string {
  const s =
    typeof status === 'number'
      ? status
      : isNaN(Number(status))
      ? status
      : Number(status);
  switch (s) {
    case AppointmentStatus.Scheduled:
      return 'مجدولة للانتظار';
    case AppointmentStatus.Cancelled:
      return 'ملغاة';
    case AppointmentStatus.Today:
      return 'اليوم';
    case AppointmentStatus.Absent:
      return 'غائب';
    case AppointmentStatus.Attended:
      return 'حضر';
    default:
      return String(status ?? 'غير معروفة');
  }
}
