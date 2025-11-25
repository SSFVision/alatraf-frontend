// ------------------------------
// USER MODEL (backend-like)
// ------------------------------
export interface IdentityUserMock {
  userId: number;
  userName: string;
  password: string; // mock only
  roles: string[];
  permissions: string[];
}

// ------------------------------
// LOGIN REQUEST
// ------------------------------
export interface LoginRequestMock {
  userName: string;
  password: string;
}

// ------------------------------
// TOKEN RESPONSE
// ------------------------------
export interface TokenResponseMock {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string;
  tokenType: string;
  userId: number;
}

// ------------------------------
// REFRESH TOKEN
// ------------------------------
export interface RefreshTokenRequestMock {
  expiredAccessToken: string;
  refreshToken: string;
}

// ------------------------------
// CURRENT USER RESPONSE
// ------------------------------
export interface CurrentUserMock {
  userId: number;
  name: string;
  roles: string[];
  permissions: string[];
}
