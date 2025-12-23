import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';

import { PaymentsService } from '../Services/payments.service';

import { PatientPaymentDetailsDto } from '../Models/details/patient-payment-details.dto';
import { DisabledPaymentDetailsDto } from '../Models/details/disabled-payment-details.dto';
import { WoundedPaymentDetailsDto } from '../Models/details/wounded-payment-details.dto';

@Injectable({ providedIn: 'root' })
export class PaymentPatientsCardDetailsFacade extends BaseFacade {
  private service = inject(PaymentsService);

  constructor() {
    super();
  }
  private _patientDetails = signal<PatientPaymentDetailsDto | null>(null);
  patientDetails = this._patientDetails.asReadonly();

  private _disabledDetails = signal<DisabledPaymentDetailsDto | null>(null);
  disabledDetails = this._disabledDetails.asReadonly();

  private _woundedDetails = signal<WoundedPaymentDetailsDto | null>(null);
  woundedDetails = this._woundedDetails.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();



  loadPatientDetails(paymentId: number): void {
    this.reset();
    this._isLoading.set(true);

    this.service
      .getPatientPaymentDetails(paymentId)
      .pipe(
        tap((res: ApiResult<PatientPaymentDetailsDto>) => {
          if (res.isSuccess && res.data) {
            this._patientDetails.set(res.data);
          } else {
            this.handleError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  loadDisabledDetails(paymentId: number): void {
    this.reset();
    this._isLoading.set(true);

    this.service
      .getDisabledPaymentDetails(paymentId)
      .pipe(
        tap((res: ApiResult<DisabledPaymentDetailsDto>) => {
          if (res.isSuccess && res.data) {
            this._disabledDetails.set(res.data);
          } else {
            this.handleError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  loadWoundedDetails(paymentId: number): void {
    this.reset();
    this._isLoading.set(true);

    this.service
      .getWoundedPaymentDetails(paymentId)
      .pipe(
        tap((res: ApiResult<WoundedPaymentDetailsDto>) => {
          if (res.isSuccess && res.data) {
            this._woundedDetails.set(res.data);
          } else {
            this.handleError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  
  reset(): void {
    this._patientDetails.set(null);
    this._disabledDetails.set(null);
    this._woundedDetails.set(null);
    this._isLoading.set(false);
  }

  private handleError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل تفاصيل الدفعة. يرجى المحاولة لاحقاً.');
  }
}
