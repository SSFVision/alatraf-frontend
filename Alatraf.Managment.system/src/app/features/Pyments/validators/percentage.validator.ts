// payments/validators/percentage.validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function percentageValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return null; // يُسمح بالفراغ (لو مش required)
  }

  const numberValue = Number(value);

  if (isNaN(numberValue)) {
    return { percentage: 'notNumber' };
  }

  if (numberValue < 0 || numberValue > 100) {
    return { percentage: 'outOfRange' };
  }

  return null;
}

export function numericValidator(control: AbstractControl) {
  const value = control.value;
  if (value === null || value === '') return null;

  return isNaN(Number(value)) ? { numeric: true } : null;
}

