import { expect } from 'vitest'

export const apiTestUtils = {
  validateApiResponse: (response: any) => {
    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('message')
    expect(response).toHaveProperty('data')
    expect(typeof response.code).toBe('number')
    expect(typeof response.message).toBe('string')
  },

  validateSuccessResponse: (response: any, expectedData?: any) => {
    expect(response.code).toBe(200)
    expect(response.message).toBe('success')
    if (expectedData) {
      expect(response.data).toEqual(expectedData)
    }
  },

  validateErrorResponse: (response: any, expectedCode?: number, expectedMessage?: string) => {
    expect(response.code).toBeGreaterThanOrEqual(400)
    if (expectedCode) {
      expect(response.code).toBe(expectedCode)
    }
    if (expectedMessage) {
      expect(response.message).toBe(expectedMessage)
    }
  },
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    REGISTER: '/api/auth/register',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    DELETE: '/api/user/delete',
  },
} as const
