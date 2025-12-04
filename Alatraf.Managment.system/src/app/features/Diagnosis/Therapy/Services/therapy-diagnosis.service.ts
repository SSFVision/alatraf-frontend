import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { WaitingPatientDto } from '../../Shared/Models/WaitingPatientDto';
import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { MedicalProgramDto } from '../Models/medical-program.dto';
import { TherapyDiagnosisDto } from '../Models/therapy-diagnosis.dto';
import { TherapyWaitingFilterDto } from '../Models/TherapyWaitingFilterDto ';

@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisService extends BaseApiService {

  getWaitingPatients(
    filter: TherapyWaitingFilterDto
  ): Observable<ApiResult<WaitingPatientDto[]>> {
    return this.post<WaitingPatientDto[]>('/doctor/therapy/waiting', filter);
  }


  createTherapyDiagnosis(
    dto: CreateTherapyCardRequest
  ): Observable<ApiResult<boolean>> {
    return this.post<boolean>('/doctor/therapy/create', dto);
  }


  getPreviousDiagnoses(
    ticketId: number
  ): Observable<ApiResult<TherapyDiagnosisDto[]>> {
    return this.get<TherapyDiagnosisDto[]>(`/doctor/therapy/details/${ticketId}`);
  }

 
  getMedicalPrograms(): Observable<ApiResult<MedicalProgramDto[]>> {
    return this.get<MedicalProgramDto[]>('/doctor/therapy/medical-programs');
  }
}
