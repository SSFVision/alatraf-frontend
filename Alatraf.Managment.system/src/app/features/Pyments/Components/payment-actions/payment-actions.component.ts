import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { AccountKind } from '../../Models/account-kind.enum';
import {
  PaymentTypeConfig,
  PAYMENT_TYPE_CONFIG,
} from '../../Configs/payment-type.config';
import { ACCOUNT_KIND_LABELS } from '../../Constants/account-kind-labels';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaymentSubmitEvent } from '../../Models/payment-submit-event';
import { NgIf } from '@angular/common';
import {
  numericValidator,
  percentageValidator,
} from '../../validators/percentage.validator';
import { PositiveNumberDirective } from '../../../../shared/Directives/positive-number.directive';
import { FormValidationState } from '../../../../core/utils/form-validation-state';

@Component({
  selector: 'app-payment-actions',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, PositiveNumberDirective],
  templateUrl: './payment-actions.component.html',
  styleUrl: './payment-actions.component.css',
})
export class PaymentActionsComponent {
  @Input({ required: true }) allowedAccountKinds!: AccountKind[];
  @Input() disabled = false;

  @Input({ required: true }) totalAmount!: number;

  @Output() submitPayment = new EventEmitter<PaymentSubmitEvent>();

  private fb = inject(FormBuilder);

  ACCOUNT_KIND_LABELS = ACCOUNT_KIND_LABELS;

  selectedAccountKind = signal<AccountKind | null>(null);

  selectedConfig = computed<PaymentTypeConfig | null>(() => {
    const kind = this.selectedAccountKind();
    return kind === null ? null : PAYMENT_TYPE_CONFIG[kind];
  });

  form: FormGroup = this.fb.group({
    accountKind: [null, Validators.required],

    totalAmount: [{ value: 0, disabled: true }],
    discount: [
      null,
      [
        Validators.min(0),
        Validators.max(100),
        percentageValidator,
        numericValidator,
      ],
    ],

    netAmount: [{ value: 0, disabled: true }],
  });
  formValidationErrors = signal<Record<string, string[]>>({});
  validationState!: FormValidationState;

  constructor() {
    this.form.get('accountKind')!.valueChanges.subscribe((kind) => {
      this.selectedAccountKind.set(kind);
      this.buildFormForAccountKind(kind);
    });

    this.form.get('discount')!.valueChanges.subscribe((discount) => {
      this.recalculateNetAmount(discount);
    });

    this.validationState = new FormValidationState(
      this.form,
      this.formValidationErrors
    );

    effect(() => {
      this.validationState.apply();
    });

    this.validationState.clearOnEdit();
  }

  ngOnChanges(): void {
    if (this.totalAmount != null) {
      this.form.patchValue({
        totalAmount: this.totalAmount,
      });
      const discount = this.form.get('discount')?.value ?? null;
      this.recalculateNetAmount(discount);
    }
  }

  private buildFormForAccountKind(kind: AccountKind | null): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      if (
        !['accountKind', 'totalAmount', 'discount', 'netAmount'].includes(
          controlName
        )
      ) {
        this.form.removeControl(controlName);
      }
    });

    if (kind === null) return;

    const config = PAYMENT_TYPE_CONFIG[kind];

    if (config.showPaidAmount) {
      this.form.addControl(
        'paidAmount',
        this.fb.control(null, [
          Validators.required,
          Validators.min(0),
          numericValidator,
        ])
      );
    }

    if (config.showVoucherNumber) {
      this.form.addControl(
        'voucherNumber',
        this.fb.control('', [Validators.required, numericValidator])
      );
    }

    if (config.showDisabledCardId) {
      this.form.addControl(
        'cardNumber',
        this.fb.control(null, [Validators.required, Validators.min(1)])
      );
    }

    if (config.showReportNumber) {
      this.form.addControl(
        'reportNumber',
        this.fb.control(null, [Validators.min(0)])
      );
    }

    if (config.showNotes) {
      this.form.addControl('notes', this.fb.control(''));
    }
  }

  private recalculateNetAmount(discount: number | null): void {
    const total = this.form.get('totalAmount')?.value ?? 0;
    const percent = discount ?? 0;

    const safePercent = Math.min(Math.max(percent, 0), 100);

    const net = total - (total * safePercent) / 100;
    this.form.patchValue({ netAmount: Math.max(net, 0) }, { emitEvent: false });
  }

  onSubmit(): void {
    const kind = this.selectedAccountKind();

    if (kind === null) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    switch (kind) {
      case AccountKind.Free:
        this.submitPayment.emit({
          accountKind: AccountKind.Free,
          payload: {},
        });
        break;

      case AccountKind.Patient:
        this.submitPayment.emit({
          accountKind: AccountKind.Patient,
          payload: {
            paidAmount: value.paidAmount,
            discount: value.discount ?? null,
            voucherNumber: value.voucherNumber,
            notes: value.notes ?? null,
          },
        });
        break;

      case AccountKind.Disabled:
        this.submitPayment.emit({
          accountKind: AccountKind.Disabled,
          payload: {
            cardNumber: value.cardNumber,
            notes: value.notes ?? null,
          },
        });
        break;

      case AccountKind.Wounded:
        this.submitPayment.emit({
          accountKind: AccountKind.Wounded,
          payload: {
            reportNumber: value.reportNumber ?? null,
            notes: value.notes ?? null,
          },
        });
        break;
    }
  }
}
