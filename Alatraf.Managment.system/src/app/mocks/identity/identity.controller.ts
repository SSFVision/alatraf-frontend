import { RequestInfo } from 'angular-in-memory-web-api';
import { IDENTITY_USERS_MOCK } from './identity.mock';

import {
  TokenResponseMock,
  RefreshTokenRequestMock,
  LoginRequestMock,
  CurrentUserMock,
} from './identity.dto';

export class IdentityController {

  // Store token with metadata
  private static accessTokens: Record<string, { userId: number; expiresAt: number }> = {};
  private static refreshTokens: Record<string, { userId: number; expiresAt: number }> = {};

  // ==============================================================
  // LOGIN
  // ==============================================================
  static login(reqInfo: RequestInfo) {
    try {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) as LoginRequestMock;

      const user = IDENTITY_USERS_MOCK.find(
        (u) => u.userName === body.userName && u.password === body.password
      );

      if (!user) {
        return this.mockError(reqInfo, 401, 'Invalid username or password.');
      }

      const accessToken = this.generateToken();
      const refreshToken = this.generateToken();

      // Store tokens with expiration timestamps
      this.accessTokens[accessToken] = {
        userId: user.userId,
        expiresAt: Date.now() + 1 * 60 * 1000, // access: 1 min
      };

      this.refreshTokens[refreshToken] = {
        userId: user.userId,
        expiresAt: Date.now() + 10 * 60 * 1000, // refresh: 10 min
      };

      const response: TokenResponseMock = {
        accessToken,
        refreshToken,
        expiresOnUtc: new Date(Date.now() + 1 * 60 * 1000).toISOString(),
        tokenType: 'Bearer',
        userId: user.userId,
      };

      return reqInfo.utils.createResponse$(() => ({ status: 200, body: response }));
    } catch {
      return this.mockError(reqInfo, 500, 'Failed to login.');
    }
  }

  // ==============================================================
  // REFRESH TOKEN
  // ==============================================================
  static refresh(reqInfo: RequestInfo) {
    try {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) as RefreshTokenRequestMock;
      const stored = this.refreshTokens[body.refreshToken];

      // Check refresh token validity
      if (!stored) {
        return this.mockError(reqInfo, 401, 'Refresh token invalid.');
      }

      // Check expiration
      if (stored.expiresAt < Date.now()) {
        delete this.refreshTokens[body.refreshToken];
        return this.mockError(reqInfo, 401, 'Refresh token expired.');
      }

      const userId = stored.userId;

      // ROTATE TOKENS
      const newAccess = this.generateToken();
      const newRefresh = this.generateToken();

      this.accessTokens[newAccess] = {
        userId,
        expiresAt: Date.now() + 1 * 60 * 1000, // 1 minute
      };

      this.refreshTokens[newRefresh] = {
        userId,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      // Delete old refresh
      delete this.refreshTokens[body.refreshToken];

      const response: TokenResponseMock = {
        accessToken: newAccess,
        refreshToken: newRefresh,
        expiresOnUtc: new Date(Date.now() + 1 * 60 * 1000).toISOString(),
        tokenType: 'Bearer',
        userId,
      };

      return reqInfo.utils.createResponse$(() => ({ status: 200, body: response }));
    } catch {
      return this.mockError(reqInfo, 500, 'Failed to refresh token.');
    }
  }

  // ==============================================================
  // CURRENT USER CLAIMS
  // ==============================================================
  static getCurrentUser(reqInfo: RequestInfo) {
    try {
      const req: any = reqInfo.req;
      const authHeader = req.headers?.get('Authorization');

      if (!authHeader) {
        return this.mockError(reqInfo, 401, 'No authorization header.');
      }

      const token = authHeader.replace('Bearer', '').trim();
      const stored = this.accessTokens[token];

      if (!stored) {
        return this.mockError(reqInfo, 401, 'Invalid access token.');
      }

      // Check access token expiration
      if (stored.expiresAt < Date.now()) {
        delete this.accessTokens[token];
        return this.mockError(reqInfo, 401, 'Access token expired.');
      }

      const user = IDENTITY_USERS_MOCK.find((u) => u.userId === stored.userId);

      if (!user) {
        return this.mockError(reqInfo, 404, 'User not found.');
      }

      const response: CurrentUserMock = {
        userId: user.userId,
        name: user.userName,
        roles: user.roles,
        permissions: user.permissions,
      };

      return reqInfo.utils.createResponse$(() => ({ status: 200, body: response }));
    } catch {
      return this.mockError(reqInfo, 500, 'Failed to load user claims.');
    }
  }

  // ==============================================================
  // UTILITIES
  // ==============================================================
  private static generateToken(): string {
    return Math.random().toString(36).substring(2);
  }

  private static mockError(
  reqInfo: RequestInfo,
  status: number,
  message: string
) {
  return reqInfo.utils.createResponse$(() => ({
    status,
    body: {
      isSuccess: false,
      errorMessage: message,
    },
  }));
}

}
