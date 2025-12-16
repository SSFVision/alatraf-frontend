import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AssignDoctorToSectionRoomRequest } from '../Models/assign-doctor-to-section-room.request';
import { AssignDoctorToSectionRequest } from '../Models/assign-doctor-to-section.request';
import { CreateDoctorRequest } from '../Models/create-doctor.request';
import { DoctorListItemDto } from '../Models/doctor-list-item.dto';
import { DoctorDto } from '../Models/doctor.dto';
import { UpdateDoctorRequest } from '../Models/update-doctor.request';
import { DoctorsFilterRequest } from '../Models/doctors-filter.request';
import { TechnicianFilterRequest } from '../Models/technicians/technician-filter.request';
import { TechnicianDto } from '../Models/technicians/technician.dto';
import { TherapistFilterRequest } from '../Models/therapists/therapist-filter.request';
import { TherapistDto } from '../Models/therapists/therapist.dto';


@Injectable({
  providedIn: 'root',
})
export class DoctorService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/doctors';

 
  getDoctors(
    filters: DoctorsFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<DoctorListItemDto>>> {
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

    return this.get<PaginatedList<DoctorListItemDto>>(this.endpoint, params);
  }

  // -----------------------------
  // GET: Doctor By Id
  // -----------------------------
  getDoctorById(doctorId: number): Observable<ApiResult<DoctorDto>> {
    return this.get<DoctorDto>(`${this.endpoint}/${doctorId}`);
  }

  // -----------------------------
  // POST: Create Doctor
  // -----------------------------
  createDoctor(
    dto: CreateDoctorRequest
  ): Observable<ApiResult<DoctorDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<DoctorDto>(this.endpoint, dto, headers);
  }

  // -----------------------------
  // PUT: Update Doctor
  // -----------------------------
  updateDoctor(
    doctorId: number,
    dto: UpdateDoctorRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${doctorId}`, dto, headers);
  }

  // -----------------------------
  // PATCH: End Doctor Assignment
  // -----------------------------
  endDoctorAssignment(
    doctorId: number
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.patch<void>(
      `${this.endpoint}/end-assignment/${doctorId}`,
      null,
      headers
    );
  }

  // -----------------------------
  // PUT: Assign Doctor To Section
  // -----------------------------
  assignDoctorToSection(
    doctorId: number,
    dto: AssignDoctorToSectionRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(
      `${this.endpoint}/assign-to-section/${doctorId}`,
      dto,
      headers
    );
  }

  // -----------------------------
  // PUT: Assign Doctor To Section & Room
  // -----------------------------
  assignDoctorToSectionRoom(
    doctorId: number,
    dto: AssignDoctorToSectionRoomRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(
      `${this.endpoint}/assign-to-section-room/${doctorId}`,
      dto,
      headers
    );
  }


  getTechniciansDropdown(
  filters: TechnicianFilterRequest,
  pagination: PageRequest
): Observable<ApiResult<PaginatedList<TechnicianDto>>> {
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

  return this.get<PaginatedList<TechnicianDto>>(
    `${this.endpoint}/technicians`,
    params
  );
}

// -----------------------------
// GET: Therapists Dropdown
// -----------------------------
getTherapistsDropdown(
  filters: TherapistFilterRequest,
  pagination: PageRequest
): Observable<ApiResult<PaginatedList<TherapistDto>>> {
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

  return this.get<PaginatedList<TherapistDto>>(
    `${this.endpoint}/therapists`,
    params
  );
}
}
