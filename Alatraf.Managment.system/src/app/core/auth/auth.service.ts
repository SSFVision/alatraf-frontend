import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from './models/login-request.model';
import { RefreshTokenRequest } from './models/refresh-token-request.model';
import { TokenResponse } from './models/token-response.model';
import { UserDetailsDto } from './models/user-details.dto.';
import { ChangeCredentialsRequest } from '../../features/UsersMangment/Models/change-credentials.request';
import { ApiResult } from '../models/ApiResult';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.identityBaseUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.baseUrl}/token/generate`,
      request
    );
  }

  // ---------------------------------------------------------
  // 2. Refresh Access Token
  // ---------------------------------------------------------
  refreshToken(request: RefreshTokenRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.baseUrl}/token/refresh-token`,
      request
    );
  }

  // ---------------------------------------------------------
  // 3. Get Current User Info (userId, roles, permissions)
  // ---------------------------------------------------------
  getCurrentUser(): Observable<UserDetailsDto> {
    return this.http.get<UserDetailsDto>(`${this.baseUrl}/current-user/claims`);
  }
  private readonly endpoint = environment.identityBaseUrl;


}
