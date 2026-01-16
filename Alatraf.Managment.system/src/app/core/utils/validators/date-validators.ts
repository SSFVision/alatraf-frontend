import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const noFutureDatesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const selectedDate = new Date(control.value);
  if (isNaN(selectedDate.getTime())) return null;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return selectedDate.getTime() > today.getTime() ? { futureDate: true } : null;
};

export const noPastDatesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const selectedDate = new Date(control.value);
  if (isNaN(selectedDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate.getTime() < today.getTime() ? { pastDate: true } : null;
};
