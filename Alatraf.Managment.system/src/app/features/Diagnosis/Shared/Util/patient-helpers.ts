export  function CalcAgeFromBirthdateHelper(date: string | undefined): number {
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