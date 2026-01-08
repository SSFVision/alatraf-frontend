import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { DepartmentDto } from './Models/department.dto';
import { CreateDepartmentRequest } from './Models/create-department.request';
import { UpdateDepartmentRequest } from './Models/update-department.request';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsManagementService extends BaseApiService {
  private readonly endpoint =
    'departments';

  constructor(http: HttpClient) {
    super(http);
  }

  // ---------------------------------------------
  // GET ALL DEPARTMENTS
  // ---------------------------------------------
  getDepartments(): Observable<ApiResult<DepartmentDto[]>> {
    return this.get<DepartmentDto[]>(this.endpoint);
  }

  // ---------------------------------------------
  // GET DEPARTMENT BY ID
  // ---------------------------------------------
  getDepartmentById(
    departmentId: number
  ): Observable<ApiResult<DepartmentDto>> {
    return this.get<DepartmentDto>(
      `${this.endpoint}/${departmentId}`
    );
  }

  // ---------------------------------------------
  // CREATE DEPARTMENT
  // ---------------------------------------------
  createDepartment(
    dto: CreateDepartmentRequest
  ): Observable<ApiResult<DepartmentDto>> {
    return this.post<DepartmentDto>(this.endpoint, dto);
  }

  // ---------------------------------------------
  // UPDATE DEPARTMENT
  // ---------------------------------------------
  updateDepartment(
    departmentId: number,
    dto: UpdateDepartmentRequest
  ): Observable<ApiResult<void>> {
    return this.put<void>(
      `${this.endpoint}/${departmentId}`,
      dto
    );
  }

  // ---------------------------------------------
  // DELETE DEPARTMENT
  // ---------------------------------------------
  deleteDepartment(
    departmentId: number
  ): Observable<ApiResult<void>> {
    return this.delete<void>(
      `${this.endpoint}/${departmentId}`
    );
  }
}
