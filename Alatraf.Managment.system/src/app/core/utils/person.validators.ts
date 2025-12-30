import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function yemeniPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      return {
        yemeniPhoneNumber: {
          valid: false,
          message: 'القيمة المدخلة ليست نصاً',
        },
      };
    }

    const yemeniPhoneRegex = /^(77|78|73|71|70)\d{7}$/;

    const isValid = yemeniPhoneRegex.test(value);

    return isValid
      ? null
      : {
          yemeniPhoneNumber: {
            valid: false,
            message:
              'يجب أن يكون رقم الهاتف 9 أرقام ويبدأ بـ (77, 78, 73, 71, 70).',
          },
        };
  };
}
export function preventNonNumericInput(event: KeyboardEvent): void {
  const char = event.key;
  if (
    !/^\d$/.test(char) &&
    char !== 'Backspace' &&
    char !== 'Delete' &&
    !/^Arrow/.test(char) &&
    char !== 'Tab' &&
    char !== 'Enter'
  ) {
    event.preventDefault();
  }
}
export function formatPhoneNumberInput(control: AbstractControl | null): void {
  if (!control || control.value === null || typeof control.value !== 'string') {
    return;
  }
  
  const cleanedValue = control.value.replace(/\D/g, ''); 
  const truncatedValue = cleanedValue.slice(0, 9);

  control.setValue(truncatedValue, { emitEvent: false });
}

export function FormatDateForInput(dateString: string | null | undefined): string | null {
  if (!dateString) {
    return null;
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { 
      return null;
    }
    return date.toISOString().split('T')[0];
  } catch {
    return null; 
  }
}


export function ChangeGenderToBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const lowercasedValue = value.toLowerCase();
    if (lowercasedValue === 'male' || lowercasedValue === 'ذكر') {
      return true;
    }
    if (lowercasedValue === 'female' || lowercasedValue === 'أنثى') {
      return false;
    }
  }
  return true; // Default to true (e.g., male) if input is ambiguous
}
