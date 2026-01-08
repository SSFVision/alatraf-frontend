export const TOKEN_KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
  expiration: 'expiration',
} as const;

export type TokenKey = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
