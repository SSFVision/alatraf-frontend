import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Login models
import { GenerateTokenRequest } from '../Models/Login/generate-token.request';
import { RefreshTokenRequest } from '../Models/Login/refresh-token.request';
import { TokenResponse } from '../Models/Login/token-response.model';
import { UserDetailsDto } from '../Models/Login/user-details.dto';

// User management models
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ActivateUserRequest } from '../Models/activate-user.request';
import { AssignRolesRequest } from '../Models/assign-roles.request';
import { ChangeCredentialsRequest } from '../Models/change-credentials.request';
import { CreateRoleRequest } from '../Models/create-role.request';
import { CreateUserRequest } from '../Models/create-user.request';
import { GetUserFilterRequest } from '../Models/get-user-filter.request';
import { PermissionIdsRequest } from '../Models/permission-ids.request';
import { PermissionDto } from '../Models/Permissions/permission.dto';
import { RemoveRolesRequest } from '../Models/remove-roles.request';
import { ResetPasswordRequest } from '../Models/reset-password.request';
import { RoleDetailsDto } from '../Models/Roles/role-details.dto';
import { UserListItemDto } from '../Models/Users/user-list-item.dto';

@Injectable({ providedIn: 'root' })
export class IdentityService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/identity';

  // Tokens
  generateToken(
    dto: GenerateTokenRequest
  ): Observable<ApiResult<TokenResponse>> {
    const url = `${this.endpoint}/token/generate`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<TokenResponse>(url, dto, headers);
  }

  refreshToken(dto: RefreshTokenRequest): Observable<ApiResult<TokenResponse>> {
    const url = `${this.endpoint}/token/refresh-token`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<TokenResponse>(url, dto, headers);
  }

  // Current user
  getCurrentUserInfo(): Observable<ApiResult<UserDetailsDto>> {
    const url = `${this.endpoint}/current-user/claims`;
    return this.get<UserDetailsDto>(url);
  }

  // Users CRUD + credentials
  createUser(dto: CreateUserRequest): Observable<ApiResult<string>> {
    const url = `${this.endpoint}/users`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<string>(url, dto, headers);
  }

  activateUser(
    userId: string,
    dto: ActivateUserRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/activation`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.patch<void>(url, dto, headers);
  }

  resetPassword(
    userId: string,
    dto: ResetPasswordRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/password/reset`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.patch<void>(url, dto, headers);
  }

  changeCredentials(
    userId: string,
    dto: ChangeCredentialsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/credentials`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.patch<void>(url, dto, headers);
  }

  getUserById(userId: string): Observable<ApiResult<UserDetailsDto>> {
    const url = `${this.endpoint}/users/${userId}`;
    return this.get<UserDetailsDto>(url);
  }

  getUsers(
    filter?: GetUserFilterRequest
  ): Observable<ApiResult<UserListItemDto[]>> {
    const url = `${this.endpoint}/users`;
    let params = new HttpParams();
    if (filter?.searchBy) params = params.set('searchBy', filter.searchBy);
    if (filter?.isActive !== undefined)
      params = params.set('isActive', filter.isActive);
    return this.get<UserListItemDto[]>(url, params);
  }

  // Roles assignment/removal
  assignRoles(
    userId: string,
    dto: AssignRolesRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/roles`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<void>(url, dto, headers);
  }

  removeRoles(
    userId: string,
    dto: RemoveRolesRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/roles`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.deleteWithBody<void>(url, dto, headers);
  }

  

  // Roles management
  createRole(dto: CreateRoleRequest): Observable<ApiResult<string>> {
    const url = `${this.endpoint}/roles`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<string>(url, dto, headers);
  }

  deleteRole(roleId: string): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/roles/${roleId}`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(url, undefined, headers);
  }

  assignPermissionsToRole(
    roleId: string,
    dto: PermissionIdsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/roles/${roleId}/permissions`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<void>(url, dto, headers);
  }

  removePermissionsFromRole(
    roleId: string,
    dto: PermissionIdsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/roles/${roleId}/permissions`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.deleteWithBody<void>(url, dto, headers);
  }

 

  getRoles(): Observable<ApiResult<RoleDetailsDto[]>> {
    const url = `${this.endpoint}/roles`;
    return this.get<RoleDetailsDto[]>(url);
  }

  // Permission overrides
  grantPermissionsToUser(
    userId: string,
    dto: PermissionIdsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/permissions/grant`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<void>(url, dto, headers);
  }

  denyPermissionsToUser(
    userId: string,
    dto: PermissionIdsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/permissions/deny`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<void>(url, dto, headers);
  }

  removeUserPermissionOverrides(
    userId: string,
    dto: PermissionIdsRequest
  ): Observable<ApiResult<void>> {
    const url = `${this.endpoint}/users/${userId}/permissions`;
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.deleteWithBody<void>(url, dto, headers);
  }

  

  // Permissions queries
  getEffectiveUserPermissions(userId: string): Observable<ApiResult<string[]>> {
    const url = `${this.endpoint}/users/${userId}/permissions`;
    return this.get<string[]>(url);
  }

  getAllPermissions(search?: string): Observable<ApiResult<PermissionDto[]>> {
    const url = `${this.endpoint}/permissions`;
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.get<PermissionDto[]>(url, params);
  }
}
