import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/services/base-api.service';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';

import { PaymentDto } from '../Models/payment.dto';
import { PaymentReference } from '../Models/payment-reference.enum';
import { GetPaymentsWaitingListFilterRequest } from '../Models/get-payments-waitingList-filter-request';
import { PaymentWaitingListDto } from '../Models/payment-waitingList-dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/payments';

 
  getPaymentById(
    paymentId: number
  ): Observable<ApiResult<PaymentDto>> {
    return this.get<PaymentDto>(`${this.endpoint}/${paymentId}`);
  }


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


  getTherapyPaymentById(
    paymentId: number,
    paymentReference: PaymentReference
  ): Observable<ApiResult<PaymentDto>> {
    return this.get<PaymentDto>(
      `${this.endpoint}/therapy-payments/${paymentId}/payment-reference/${paymentReference}`
    );
  }


  getRepairPaymentById(
    paymentId: number,
    paymentReference: PaymentReference
  ): Observable<ApiResult<PaymentDto>> {
    return this.get<PaymentDto>(
      `${this.endpoint}/repair-payments/${paymentId}/payment-reference/${paymentReference}`
    );
  }
}
