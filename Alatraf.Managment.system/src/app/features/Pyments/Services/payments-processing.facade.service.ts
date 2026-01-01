import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';

import { PaymentsService } from '../Services/payments.service';

import { TherapyPaymentDto } from '../Models/therapy-payment.dto';
import { RepairPaymentDto } from '../Models/repair-payment.dto';

import { PaymentReference } from '../Models/payment-reference.enum';
import { PayDisabledPaymentRequest } from '../Models/PaymentTypesRequests/pay-disabled-payment.request';
import { PayPatientPaymentRequest } from '../Models/PaymentTypesRequests/pay-patient-payment.request';
import { PayWoundedPaymentRequest } from '../Models/PaymentTypesRequests/pay-wounded-payment.request';

@Injectable({ providedIn: 'root' })
export class PaymentsProcessingFacade extends BaseFacade {
  private service = inject(PaymentsService);

  constructor() {
    super();
  }

  /* ---------------------------------------------
   * STATE
   * --------------------------------------------- */

  private _therapyPayment = signal<TherapyPaymentDto | null>(null);
  therapyPayment = this._therapyPayment.asReadonly();

  private _repairPayment = signal<RepairPaymentDto | null>(null);
  repairPayment = this._repairPayment.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  private _isPaying = signal<boolean>(false);
  isPaying = this._isPaying.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  
  loadTherapyPayment(
    paymentId: number,
    paymentReference: PaymentReference
  ): void {
    this._isLoading.set(true);
    this._therapyPayment.set(null);
    this._repairPayment.set(null);
    this.formValidationErrors.set({}); // 🔹 clear old errors

    this.service
      .getTherapyPayment(paymentId, paymentReference)
      .pipe(
        tap((res: ApiResult<TherapyPaymentDto>) => {
          if (res.isSuccess && res.data) {
            this._therapyPayment.set(res.data);
          } else {
            this.handleError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  loadRepairPayment(
    paymentId: number,
    paymentReference: PaymentReference
  ): void {
    this._isLoading.set(true);
    this._therapyPayment.set(null);
    this._repairPayment.set(null);
    this.formValidationErrors.set({}); // 🔹 clear old errors

    this.service
      .getRepairPayment(paymentId, paymentReference)
      .pipe(
        tap((res: ApiResult<RepairPaymentDto>) => {
          if (res.isSuccess && res.data) {
            this._repairPayment.set(res.data);
          } else {
            this.handleError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  /* ---------------------------------------------
   * PAY ACTIONS
   * --------------------------------------------- */

  payFree(paymentId: number) {
    this._isPaying.set(true);
    this.formValidationErrors.set({});

    return this.service.payFree(paymentId, {}).pipe(
      tap((res) => {
        this._isPaying.set(false);

        if (res.isSuccess) {
          this.toast.success('تم إتمام الدفع المجاني بنجاح');
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        } else {
          this.handleError(res);
        }
      })
    );
  }

  payPatient(paymentId: number, body: PayPatientPaymentRequest) {
    this._isPaying.set(true);
    this.formValidationErrors.set({});

    return this.service.payPatient(paymentId, body).pipe(
      tap((res) => {
        this._isPaying.set(false);

        if (res.isSuccess) {
          this.toast.success('تم إتمام الدفع بنجاح');
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        } else {
          this.handleError(res);
        }
      })
    );
  }

  payDisabled(paymentId: number, body: PayDisabledPaymentRequest) {
    this._isPaying.set(true);
    this.formValidationErrors.set({});

    return this.service.payDisabled(paymentId, body).pipe(
      tap((res) => {
        this._isPaying.set(false);

        if (res.isSuccess) {
          this.toast.success('تم إتمام الدفع بنجاح');
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        } else {
          this.handleError(res);
        }
      })
    );
  }

  payWounded(paymentId: number, body: PayWoundedPaymentRequest) {
    this._isPaying.set(true);
    this.formValidationErrors.set({});

    return this.service.payWounded(paymentId, body).pipe(
      tap((res) => {
        this._isPaying.set(false);

        if (res.isSuccess) {
          this.toast.success('تم إتمام الدفع بنجاح');
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        } else {
          this.handleError(res);
        }
      })
    );
  }

  /* ---------------------------------------------
   * ERROR HANDLING
   * --------------------------------------------- */

  private handleError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة لاحقاً.');
  }

  /* ---------------------------------------------
   * RESET
   * --------------------------------------------- */

  reset(): void {
    this._therapyPayment.set(null);
    this._repairPayment.set(null);
    this._isLoading.set(false);
    this._isPaying.set(false);
    this.formValidationErrors.set({}); // ✅ مهم
  }
}
