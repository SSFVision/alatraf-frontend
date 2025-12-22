import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/services/base-api.service';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';

import { GetPaymentsWaitingListFilterRequest } from '../Models/get-payments-waitingList-filter-request';

import { PaymentWaitingListDto } from '../Models/payment-waitingList-dto';
import { PaymentListItemDto } from '../Models/payment-list-item.dto';
import { PaymentCoreDto } from '../Models/payment-core.dto';

import { TherapyPaymentDto } from '../Models/therapy-payment.dto';
import { RepairPaymentDto } from '../Models/repair-payment.dto';

import { PatientPaymentDetailsDto } from '../Models/details/patient-payment-details.dto';
import { DisabledPaymentDetailsDto } from '../Models/details/disabled-payment-details.dto';
import { WoundedPaymentDetailsDto } from '../Models/details/wounded-payment-details.dto';

import { PaymentReference } from '../Models/payment-reference.enum';
import { PaymentsFilterRequest } from '../Models/payments-filter.request';
import { PayDisabledPaymentRequest } from '../Models/PaymentTypesRequests/pay-disabled-payment.request';
import { PayFreePaymentRequest } from '../Models/PaymentTypesRequests/pay-free-payment.request';
import { PayPatientPaymentRequest } from '../Models/PaymentTypesRequests/pay-patient-payment.request';
import { PayWoundedPaymentRequest } from '../Models/PaymentTypesRequests/pay-wounded-payment.request';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/payments';

  getPaymentsWaitingList(
    filter: GetPaymentsWaitingListFilterRequest,
    pageRequest: PageRequest
  ): Observable<ApiResult<PaginatedList<PaymentWaitingListDto>>> {
    let params = new HttpParams()
      .set('page', pageRequest.page)
      .set('pageSize', pageRequest.pageSize);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<PaymentWaitingListDto>>(
      `${this.endpoint}/waiting-list`,
      params
    );
  }

  // ===============================
  // Therapy / Repair Payments
  // ===============================
  getTherapyPayment(
    paymentId: number,
    paymentReference: PaymentReference
  ): Observable<ApiResult<TherapyPaymentDto>> {
    return this.get<TherapyPaymentDto>(
      `${this.endpoint}/therapy-payments/${paymentId}/payment-reference/${paymentReference}`
    );
  }

  getRepairPayment(
    paymentId: number,
    paymentReference: PaymentReference
  ): Observable<ApiResult<RepairPaymentDto>> {
    return this.get<RepairPaymentDto>(
      `${this.endpoint}/repair-payments/${paymentId}/payment-reference/${paymentReference}`
    );
  }

  getPayments(
    filter: PaymentsFilterRequest,
    pageRequest: PageRequest
  ): Observable<ApiResult<PaginatedList<PaymentListItemDto>>> {
    let params = new HttpParams()
      .set('page', pageRequest.page)
      .set('pageSize', pageRequest.pageSize);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<PaymentListItemDto>>(this.endpoint, params);
  }

  // ===============================
  // Get Payment Core
  // ===============================
  getPaymentById(paymentId: number): Observable<ApiResult<PaymentCoreDto>> {
    return this.get<PaymentCoreDto>(`${this.endpoint}/${paymentId}`);
  }

  // ===============================
  // Payment Details (by type)
  // ===============================
  getPatientPaymentDetails(
    paymentId: number
  ): Observable<ApiResult<PatientPaymentDetailsDto>> {
    return this.get<PatientPaymentDetailsDto>(
      `${this.endpoint}/${paymentId}/patient`
    );
  }

  getDisabledPaymentDetails(
    paymentId: number
  ): Observable<ApiResult<DisabledPaymentDetailsDto>> {
    return this.get<DisabledPaymentDetailsDto>(
      `${this.endpoint}/${paymentId}/disabled`
    );
  }

  getWoundedPaymentDetails(
    paymentId: number
  ): Observable<ApiResult<WoundedPaymentDetailsDto>> {
    return this.get<WoundedPaymentDetailsDto>(
      `${this.endpoint}/${paymentId}/wounded`
    );
  }

  payFree(
    paymentId: number,
    body: PayFreePaymentRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<void>(
      `${this.endpoint}/${paymentId}/pay/free`,
      body,
      headers
    );
  }

  payPatient(
    paymentId: number,
    body: PayPatientPaymentRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<void>(
      `${this.endpoint}/${paymentId}/pay/patient`,
      body,
      headers
    );
  }

  payDisabled(
    paymentId: number,
    body: PayDisabledPaymentRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<void>(
      `${this.endpoint}/${paymentId}/pay/disabled`,
      body,
      headers
    );
  }

  payWounded(
    paymentId: number,
    body: PayWoundedPaymentRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<void>(
      `${this.endpoint}/${paymentId}/pay/wounded`,
      body,
      headers
    );
  }
}
