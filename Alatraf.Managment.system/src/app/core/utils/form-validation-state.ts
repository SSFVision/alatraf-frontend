import { Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class FormValidationState {
  constructor(
    private form: FormGroup,
    private backendErrors: Signal<Record<string, string[]>>
  ) {}

  /** Convert PascalCase to camelCase */
  private normalizeField(field: string): string {
    if (!field) return field;
    return field.charAt(0).toLowerCase() + field.slice(1);
  }

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

    // 2️⃣ Apply backend errors
    if (errors && Object.keys(errors).length > 0) {
      for (const field in errors) {
        const normalized = this.normalizeField(field);

        let control =
          this.form.get(normalized) ??
          this.form.get(field); // fallback (if names already match)

        if (control) {
          control.setErrors({ backend: errors[field][0] });
          control.markAsTouched();
        }
      }
    }
  }

  /** Read backend error */
  getBackendError(field: string): string | null {
    const normalized = this.normalizeField(field);
    const control =
      this.form.get(normalized) ??
      this.form.get(field); // fallback

    return control?.errors?.['backend'] ?? null;
  }

  /** Check if backend has error */
  hasBackendError(field: string): boolean {
    return this.getBackendError(field) !== null;
  }

  /** Show frontend error only when backend is clean */
  hasFrontendError(field: string): boolean {
    const normalized = this.normalizeField(field);

    if (this.hasBackendError(normalized)) return false;

    const control =
      this.form.get(normalized) ??
      this.form.get(field);

    return !!(control?.invalid && control?.touched);
  }

  /** Clear backend errors on user edit */
  clearOnEdit() {
    this.form.valueChanges.subscribe(() => {
      (this.backendErrors as any).set({});
    });
  }
}
