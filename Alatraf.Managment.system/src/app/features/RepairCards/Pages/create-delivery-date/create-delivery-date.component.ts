import {
  Component,
  effect,
  EnvironmentInjector,
  inject,
  input,
  Input,
  OnInit,
  output,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { CreateDeliveryTimeRequest } from '../../Models/create-delivery-time.request';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { RepairCardsFacade } from '../../Services/repair-cards.facade.service';
import { FormValidationState } from '../../../../core/utils/form-validation-state';
import { noPastDatesValidator } from '../../../../core/utils/validators/date-validators';

@Component({
  selector: 'app-create-delivery-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-delivery-date.component.html',
  styleUrl: './create-delivery-date.component.css',
})
export class CreateDeliveryDateComponent implements OnInit {
  repairCardId = input.required<number>();
  close = output<void>();
  private fb = inject(FormBuilder);
  private facade = inject(RepairCardsFacade);
  today = new Date().toISOString().slice(0, 10);
  private env = inject(EnvironmentInjector);

  isSubmitting = signal(false);
  submissionDone = signal(false);

   form: FormGroup = this.fb.group({
    deliveryDate: ['', [Validators.required, noPastDatesValidator]],

    notes: [''],
  });
    private validationState!: FormValidationState;

  ngOnInit() {

     this.validationState = new FormValidationState(
      this.form,
    this.facade.deliveryTimeFormErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });
  }

  onSubmit() {
    if (!this.repairCardId) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request: CreateDeliveryTimeRequest = {
      deliveryDate: raw.deliveryDate!,
      notes: raw.notes || null,
    };

    this.isSubmitting.set(true);
    this.form.disable({ emitEvent: false });

    this.facade
      .createDeliveryTime(this.repairCardId(), request)
      .subscribe((_) => {
        if (this.facade.deliveryTimeCreated()) {
          this.submissionDone.set(true);
          this.form.disable({ emitEvent: false });
        }
      });
  }

  onClose() {
    this.close.emit();
  }
 getBackendError(controlName: string): string | null {
    return this.validationState.getBackendError(controlName);
  }

  hasBackendError(controlName: string): boolean {
    return this.validationState.hasBackendError(controlName);
  }

  hasFrontendError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.invalid && !!control?.touched;
  }

  get formLevelError(): string | null {
    if (this.form.errors?.['requiredDate']) {
      return 'يرجى اختيار تاريخ التسليم.';
    }
    return null;
  }

}
