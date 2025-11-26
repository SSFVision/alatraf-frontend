import { RequestInfo } from 'angular-in-memory-web-api';

import { IDENTITY_USERS_MOCK } from './identity.mock';

import {
  TokenResponseMock,
  RefreshTokenRequestMock,
  LoginRequestMock,
  CurrentUserMock,
} from './identity.dto';

export class IdentityController {
  private static refreshTokens: Record<string, number> = {};
  private static accessTokens: Record<string, number> = {};

  // --------------------------
  // LOGIN
  // --------------------------
  static login(reqInfo: RequestInfo) {
    try {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) as LoginRequestMock;

      const user = IDENTITY_USERS_MOCK.find(
        (u) => u.userName === body.userName && u.password === body.password
      );

      if (!user) {
        return IdentityController.mockError(
          reqInfo,
          401,
          'Invalid username or password.'
        );
      }

      // const accessToken = "Waleed Alhakimi"
      const accessToken = IdentityController.generateToken();
      const refreshToken = IdentityController.generateToken();

      // Store refresh token mapping
      this.refreshTokens[refreshToken] = user.userId;
      IdentityController.accessTokens[accessToken] = user.userId;

      const response: TokenResponseMock = {
        accessToken,
        refreshToken,
        expiresOnUtc: IdentityController.addMinutes(15).toISOString(),
        tokenType: 'Bearer',
        userId: user.userId,
      };
      console.log('LogIn User Info : ', response);
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: response,
      }));
    } catch (error) {
      return IdentityController.mockError(reqInfo, 500, 'Failed to login.');
    }
  }

  // --------------------------
  // REFRESH TOKEN
  // --------------------------
  static refresh(reqInfo: RequestInfo) {
    try {
      const body = reqInfo.utils.getJsonBody(
        reqInfo.req
      ) as RefreshTokenRequestMock;

      const userId = this.refreshTokens[body.refreshToken];

      if (!userId) {
        return IdentityController.mockError(
          reqInfo,
          401,
          'Refresh token invalid.'
        );
      }

      const newAccess = IdentityController.generateToken();
      const newRefresh = IdentityController.generateToken();
IdentityController.accessTokens[newAccess] = userId;

      // Replace old refresh token
      delete this.refreshTokens[body.refreshToken];
      this.refreshTokens[newRefresh] = userId;

      const response: TokenResponseMock = {
        accessToken: newAccess,
        refreshToken: newRefresh,
        expiresOnUtc: IdentityController.addMinutes(15).toISOString(),
        tokenType: 'Bearer',
        userId,
      };

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: response,
      }));
    } catch (error) {
      return IdentityController.mockError(
        reqInfo,
        500,
        'Failed to refresh token.'
      );
    }
  }

  // --------------------------
  // CURRENT USER CLAIMS
  // --------------------------
  static getCurrentUser(reqInfo: RequestInfo) {
    try {
      // SAFE way to read request headers from in-memory API
      const angularRequest: any = reqInfo.req;
      const authHeader = angularRequest.headers?.get('Authorization');

      if (!authHeader) {
        return IdentityController.mockError(
          reqInfo,
          401,
          'No authorization header.'
        );
      }

      const token = authHeader.replace('Bearer', '').trim();
      const userId = IdentityController.accessTokens[token];

      if (!userId) {
        return IdentityController.mockError(
          reqInfo,
          401,
          'Invalid access token.'
        );
      }

      const user = IDENTITY_USERS_MOCK.find((u) => u.userId === userId);

      if (!user) {
        return IdentityController.mockError(reqInfo, 404, 'User not found.');
      }

      const response: CurrentUserMock = {
        userId: user.userId,
        name: user.userName,
        roles: user.roles,
        permissions: user.permissions,
      };

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: response,
      }));
    } catch (error) {
      return IdentityController.mockError(
        reqInfo,
        500,
        'Failed to load user claims.'
      );
    }
  }

  // --------------------------
  // UTILITIES
  // --------------------------
  private static generateToken(): string {
    return Math.random().toString(36).substring(2);
  }

  private static addMinutes(minutes: number): Date {
    return new Date(Date.now() + minutes * 60000);
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
