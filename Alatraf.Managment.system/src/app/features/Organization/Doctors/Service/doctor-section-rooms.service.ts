import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { TechnicianIndustrialPartsResultDto } from '../Models/technicians/technician-industrial-parts-result.dto';
import { TherapistTodaySessionsResultDto } from '../Models/therapists/therapist-today-sessions-result.dto';


@Injectable({
  providedIn: 'root',
})
export class DoctorSectionRoomsService extends BaseApiService {
  private readonly endpoint =
    'http://localhost:2003/api/v1/doctor-section-rooms';


  getTechnicianAssignedIndustrialParts(
    doctorSectionRoomId: number
  ): Observable<ApiResult<TechnicianIndustrialPartsResultDto>> {
    return this.get<TechnicianIndustrialPartsResultDto>(
      `${this.endpoint}/${doctorSectionRoomId}/industrial-parts`
    );
  }


  getTherapistTodaySessions(
    doctorSectionRoomId: number
  ): Observable<ApiResult<TherapistTodaySessionsResultDto>> {
    return this.get<TherapistTodaySessionsResultDto>(
      `${this.endpoint}/${doctorSectionRoomId}/therapist-sessions`
    );
  }
}
