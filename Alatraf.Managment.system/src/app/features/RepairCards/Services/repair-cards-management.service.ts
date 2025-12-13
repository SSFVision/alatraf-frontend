import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AssignIndustrialPartsRequest } from '../Models/assign-industrial-parts.request';
import { DoctorAssignmentRequest } from '../Models/doctor-assignment.request';
import { ChangeRepairCardStatusRequest } from '../Models/change-repair-card-status.request';
import { CreateDeliveryTimeRequest } from '../Models/create-delivery-time.request';
import { GetPaidRepairCardsFilterRequest } from '../Models/paid-repair-cards-filter.request';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { RepairCardDiagnosisDto } from '../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto';
import { RepairCardFilterRequest } from '../Models/repair-card-filter.request';

@Injectable({
  providedIn: 'root',
})
export class RepairCardsManagementService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/repair-cards';
  getRepairCards(
    filter: RepairCardFilterRequest,
    pageRequest: PageRequest
  ): Observable<ApiResult<PaginatedList<RepairCardDiagnosisDto>>> {
    let params = new HttpParams()
      .set('page', pageRequest.page)
      .set('pageSize', pageRequest.pageSize);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<RepairCardDiagnosisDto>>(
      this.endpoint,
      params
    );
  }

  // ------------------------------------------------
  // GET: Paid Repair Cards
  // ------------------------------------------------
  getPaidRepairCards(
    filter: GetPaidRepairCardsFilterRequest,
    pageRequest: PageRequest
  ): Observable<ApiResult<PaginatedList<RepairCardDiagnosisDto>>> {
    let params = new HttpParams()
      .set('page', pageRequest.page)
      .set('pageSize', pageRequest.pageSize);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<RepairCardDiagnosisDto>>(
      `${this.endpoint}/paid`,
      params
    );
  }

  // ------------------------------------------------
  // POST: Assign Industrial Parts To Doctor
  // ------------------------------------------------
  assignIndustrialParts(
    repairCardId: number,
    request: AssignIndustrialPartsRequest
  ): Observable<ApiResult<void>> {
 

    return this.post<void>(
      `${this.endpoint}/${repairCardId}/industrial-part-assignments`,
      request,
    );
  }

  // ------------------------------------------------
  // POST: Assign Repair Card To Doctor
  // ------------------------------------------------
  assignRepairCardToDoctor(
    repairCardId: number,
    request: DoctorAssignmentRequest
  ): Observable<ApiResult<void>> {
  

    return this.post<void>(
      `${this.endpoint}/${repairCardId}/doctor-assignmets`,
      request,
    );
  }

  // ------------------------------------------------
  // PATCH: Change Repair Card Status
  // ------------------------------------------------
  updateRepairCardStatus(
    repairCardId: number,
    request: ChangeRepairCardStatusRequest
  ): Observable<ApiResult<void>> {
    return this.put<void>(
      `${this.endpoint}/${repairCardId}/status`,
      request,
    );
  }

  // ------------------------------------------------
  // POST: Create Delivery Time
  // ------------------------------------------------
  createDeliveryTime(
    repairCardId: number,
    request: CreateDeliveryTimeRequest
  ): Observable<ApiResult<void>> {
   

    return this.post<void>(
      `${this.endpoint}/${repairCardId}/delivery-time`,
      request,
    );
  }
}
