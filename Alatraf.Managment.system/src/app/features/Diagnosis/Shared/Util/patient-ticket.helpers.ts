export function calculateAge(date: string | undefined): number  {
  if (!date) return 0;
    const birth = new Date(date);
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const d = today.getDate() - birth.getDate();

    if (m < 0 || (m === 0 && d < 0)) {
      age--;
    }
    return age;
}


export function formatTicketStatus(status: string  ): string {
  if (!status) return 'غير معروف';

  switch (status.toLowerCase()) {
    case 'new': return 'جديد';
    case 'pause': return 'موقوف';
    case 'continue': return 'مستمر';
    case 'completed': return 'مكتمل';
    case 'cancelled': return 'ملغي';
    default: return 'غير معروف';
  }


}
