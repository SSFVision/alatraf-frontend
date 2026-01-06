
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from './models/login-request.model';
import { TokenResponse } from './models/token-response.model';
import { RefreshTokenRequest } from './models/refresh-token-request.model';
import { UserModel } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'api/identity' 

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



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { TokenResponse } from '../../features/UsersMangment/Models/Login/token-response.model';
// import { GenerateTokenRequest } from '../../features/UsersMangment/Models/Login/generate-token.request';
// import { RefreshTokenRequest } from '../../features/UsersMangment/Models/Login/refresh-token.request';
// import { UserDetailsDto } from '../../features/UsersMangment/Models/Login/user-details.dto';

// @Injectable({ providedIn: 'root' })
// export class AuthService {

//   private readonly baseUrl = 'http://localhost:2003/api/v1/identity';

//   constructor(private http: HttpClient) {}

//   login(request: GenerateTokenRequest): Observable<TokenResponse> {
//     return this.http.post<TokenResponse>(`${this.baseUrl}/token/generate`, request);
//   }

 
//   refreshToken(request: RefreshTokenRequest): Observable<TokenResponse> {
//     return this.http.post<TokenResponse>(`${this.baseUrl}/token/refresh-token`, request);
//   }

//   getCurrentUser(): Observable<UserDetailsDto> {
//     return this.http.get<UserDetailsDto>(`${this.baseUrl}/current-user/claims`);
//   }
// }
