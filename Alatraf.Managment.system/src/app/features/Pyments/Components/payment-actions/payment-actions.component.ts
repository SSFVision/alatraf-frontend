import {
  Component,
  computed,
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

@Component({
  selector: 'app-payment-actions',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
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

  /** ===============================
   * FORM
   * =============================== */
  form: FormGroup = this.fb.group({
    accountKind: [null, Validators.required],

    // 🔒 ثابتة – لا تُحذف
    totalAmount: [{ value: 0, disabled: true }],
    discount: [null],
    netAmount: [{ value: 0, disabled: true }],
  });

  constructor() {
    /** عند تغيير نوع الحساب */
    this.form.get('accountKind')!.valueChanges.subscribe((kind) => {
      this.selectedAccountKind.set(kind);
      this.buildFormForAccountKind(kind);
    });

    /** عند تغيير الخصم → احسب الإجمالي */
    this.form.get('discount')!.valueChanges.subscribe((discount) => {
      this.recalculateNetAmount(discount);
    });
  }

  /** استلام totalAmount من الأب */
  ngOnChanges(): void {
    if (this.totalAmount != null) {
      this.form.patchValue({
        totalAmount: this.totalAmount,
        netAmount: this.totalAmount,
      });
    }
  }

  /** ===============================
   * DYNAMIC CONTROLS
   * =============================== */
  private buildFormForAccountKind(kind: AccountKind | null): void {
    // احذف الكنترولز الديناميكية فقط
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
        this.fb.control(null, Validators.required)
      );
    }

    if (config.showVoucherNumber) {
      this.form.addControl(
        'voucherNumber',
        this.fb.control('', Validators.required)
      );
    }

    if (config.showDisabledCardId) {
      this.form.addControl(
        'disabledCardId',
        this.fb.control(null, Validators.required)
      );
    }

    if (config.showReportNumber) {
      this.form.addControl('reportNumber', this.fb.control(''));
    }

    if (config.showNotes) {
      this.form.addControl('notes', this.fb.control(''));
    }
  }

  /** ===============================
   * CALCULATION
   * =============================== */
  private recalculateNetAmount(discount: number | null): void {
    const total = this.form.get('totalAmount')?.value ?? 0;
    const safeDiscount = discount ?? 0;

    const net = Math.max(total - safeDiscount, 0);

    this.form.patchValue({ netAmount: net }, { emitEvent: false });
  }

  /** ===============================
   * SUBMIT
   * =============================== */
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
            disabledCardId: value.disabledCardId,
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
