import { Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class FormValidationState {
  constructor(
    private form: FormGroup,
    private backendErrors: Signal<Record<string, string[]>>
  ) {}

  /** Apply backend validation errors to form controls */
  apply() {
    const errors = this.backendErrors();

    // 1️⃣ Clear old backend errors
    Object.keys(this.form.controls).forEach((name) => {
      const control = this.form.get(name);
      if (control?.errors?.['backend']) {
        control.setErrors(null);
      }
    });

    // 2️⃣ Apply new backend errors
    if (errors && Object.keys(errors).length > 0) {
      for (const field in errors) {
        const control = this.form.get(field);
        if (control) {
          control.setErrors({ backend: errors[field][0] });
          control.markAsTouched();
        }
      }
    }
  }

  /** Utility for components to read backend error text */
  getBackendError(field: string): string | null {
    const control = this.form.get(field);
    return control?.errors?.['backend'] ?? null;
  }

  /** Whether the field has a backend validation error */
  hasBackendError(field: string): boolean {
    return this.getBackendError(field) !== null;
  }

  /** Hide frontend errors when backend exists */
  hasFrontendError(field: string): boolean {
    if (this.hasBackendError(field)) return false;

    const control = this.form.get(field);
    return control?.invalid && control?.touched ? true : false;
  }

  /** Clear backend errors when user edits any field */
  clearOnEdit() {
    this.form.valueChanges.subscribe(() => {
      // Clear by setting empty object
      (this.backendErrors as any).set({});
    });
  }
}
