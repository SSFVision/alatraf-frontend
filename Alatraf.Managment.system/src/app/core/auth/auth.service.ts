
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from './models/login-request.model';
import { TokenResponse } from './models/token-response.model';
import { RefreshTokenRequest } from './models/refresh-token-request.model';
import { UserModel } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = '/identity';  // 👈 Base route

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------
  // 1. Login (Generate Access + Refresh Token)
  // ---------------------------------------------------------
  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/token/generate`, request);
  }

  // ---------------------------------------------------------
  // 2. Refresh Access Token
  // ---------------------------------------------------------
  refreshToken(request: RefreshTokenRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/token/refresh-token`, request);
  }

  // ---------------------------------------------------------
  // 3. Get Current User Info (userId, roles, permissions)
  // ---------------------------------------------------------
  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/current-user/claims`);
  }
}
