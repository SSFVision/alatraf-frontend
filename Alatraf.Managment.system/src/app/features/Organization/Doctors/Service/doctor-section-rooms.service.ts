import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { GetTechnicianIndustrialPartsFilter } from '../Models/technicians/get-technician-industrial-parts.filter';
import { TechnicianHeaderDto } from '../Models/technicians/technician-header.dto';
import { TechnicianIndustrialPartDto } from '../Models/technicians/technician-industrial-part.dto';
import { GetTherapistSessionsFilter } from '../Models/therapists/get-therapist-sessions.filter';
import { TherapistHeaderDto } from '../Models/therapists/therapist-header.dto';
import { TherapistSessionProgramDto } from '../Models/therapists/therapist-session-program.dto';

@Injectable({
  providedIn: 'root',
})
export class DoctorSectionRoomsService extends BaseApiService {
  private readonly endpoint =
    'http://localhost:2003/api/v1/doctor-section-rooms';

  getTechnicianHeader(
    doctorSectionRoomId: number
  ): Observable<ApiResult<TechnicianHeaderDto>> {
    const url = `${this.endpoint}/${doctorSectionRoomId}/technician-header`;
    return this.get<TechnicianHeaderDto>(url);
  }

  getTechnicianIndustrialParts(
    doctorSectionRoomId: number,
    filter: GetTechnicianIndustrialPartsFilter
  ): Observable<ApiResult<PaginatedList<TechnicianIndustrialPartDto>>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    const url = `${this.endpoint}/${doctorSectionRoomId}/technician-industrial-parts`;
    return this.get<PaginatedList<TechnicianIndustrialPartDto>>(url, params);
  }

  getTherapistHeader(
    doctorSectionRoomId: number
  ): Observable<ApiResult<TherapistHeaderDto>> {
    const url = `${this.endpoint}/${doctorSectionRoomId}/therapist-header`;
    return this.get<TherapistHeaderDto>(url);
  }
//  getTherapistSessions(
//     filters: GetTherapistSessionsFilter,
//     pagination: PageRequest
//   ): Observable<ApiResult<PaginatedList<TherapistSessionProgramDto>>> {
//     let params = new HttpParams()
//       .set('page', pagination.page)
//       .set('pageSize', pagination.pageSize);

//     if (filters) {
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== '') {
//           params = params.set(key, value as any);
//         }
//       });
//     }
//     const url = `${this.endpoint}/${doctorSectionRoomId}/therapist-sessions`;

//     return this.get<PaginatedList<TherapistSessionProgramDto>>(this.endpoint, params);
//   }

  getTherapistSessions(
    doctorSectionRoomId: number,
    filter: GetTherapistSessionsFilter
  ): Observable<ApiResult<PaginatedList<TherapistSessionProgramDto>>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }
    const url = `${this.endpoint}/${doctorSectionRoomId}/therapist-sessions`;
    return this.get<PaginatedList<TherapistSessionProgramDto>>(url, params);
  }
}
