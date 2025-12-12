import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { ApiResult } from '../../core/models/ApiResult';
import { DepartmentSectionDto } from './Models/department-section.dto';
import { GetDoctorDto } from './Models/get-doctor.dto';
import { SectionRoomDto } from './Models/section-room.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/';
  constructor(http: HttpClient) {
    super(http);
  }
  getSectionsByDepartmentId(
    departmentId: number
  ): Observable<ApiResult<DepartmentSectionDto[]>> {
    const url = this.endpoint + `departments/${departmentId}/sections`;
    return this.get<DepartmentSectionDto[]>(url);
  }
  getRoomsBySectionId(
    sectionId: number
  ): Observable<ApiResult<SectionRoomDto[]>> {
    const url = this.endpoint + `sections/${sectionId}/rooms`;

    return this.get<SectionRoomDto[]>(url);
  }
  getDoctorsBySectionAndRoomId(
    sectionId: number,
    roomId: number
  ): Observable<ApiResult<GetDoctorDto[]>> {
    const url = this.endpoint + `sections/${sectionId}/rooms/${roomId}/doctors`;

    return this.get<GetDoctorDto[]>(url);
  }
}
