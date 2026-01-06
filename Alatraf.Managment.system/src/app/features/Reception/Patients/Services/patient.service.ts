import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { PatientFilterRequest } from '../models/PatientFilterRequest';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { PatientDto } from '../../../../core/models/Shared/patient.model';
import { CreatePatientRequest } from '../models/create-patient.request';
import { UpdatePatientRequest } from '../models/update-patient.request';
import { TherapyCardDiagnosisDto } from '../../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { RepairCardDiagnosisDto } from '../../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto';
export interface PatientFilterDto {
  searchTerm?: string;
}
@Injectable({
  providedIn: 'root',
})
export class PatientService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/patients';

  getPatients(
    filters?: PatientFilterRequest,
    pagination: PageRequest = { page: 1, pageSize: 10 }
  ): Observable<ApiResult<PaginatedList<PatientDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.get<PaginatedList<PatientDto>>(this.endpoint, params).pipe(
      tap((res) => {
        if (res.isSuccess && res.data?.items) {
        }
      })
    );
  }

  getPatientById(id: number): Observable<ApiResult<PatientDto>> {
    return this.get<PatientDto>(`${this.endpoint}/${id}`);
  }

  // CREATE a new patient
  createPatient(dto: CreatePatientRequest): Observable<ApiResult<PatientDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<PatientDto>(this.endpoint, dto, headers);
  }

  // UPDATE an existing patient
  updatePatient(
    patientId: number,
    dto: UpdatePatientRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.put<void>(`${this.endpoint}/${patientId}`, dto, headers);
  }

  // DELETE a patient
  deletePatient(id: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.delete<void>(`${this.endpoint}/${id}`, undefined, headers);
  }

  GetPatientTherapyCardsById(
    id: number
  ): Observable<ApiResult<TherapyCardDiagnosisDto[]>> {
    console.log('Fetching therapy cards for patient ID:', id);
    const url = `${this.endpoint}/${id}/therapy-cards`;
    return this.get<TherapyCardDiagnosisDto[]>(url);
  }
  GetRepairCardsByPatientId(
    id: number
  ): Observable<ApiResult<RepairCardDiagnosisDto[]>> {
    console.log('Fetching repair cards for patient ID:', id);
    const url = `${this.endpoint}/${id}//repair-cards`;
    return this.get<RepairCardDiagnosisDto[]>(url);
  }
}
