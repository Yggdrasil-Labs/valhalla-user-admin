import { expect } from 'vitest'

export const apiTestUtils = {
  validateApiResponse: (response: any) => {
    expect(response).toHaveProperty('success')
    expect(typeof response.success).toBe('boolean')
    // data 字段是可选的，如果存在则验证其类型
    if ('data' in response) {
      expect(response).toHaveProperty('data')
    }
  },

  validateSuccessResponse: (response: any, expectedData?: any) => {
    expect(response.success).toBe(true)
    if (expectedData) {
      expect(response.data).toEqual(expectedData)
    }
  },

  validateErrorResponse: (response: any, expectedErrMessage?: string, expectedErrCode?: string) => {
    expect(response.success).toBe(false)
    if (expectedErrMessage) {
      expect(response.errMessage).toBe(expectedErrMessage)
    }
    if (expectedErrCode) {
      expect(response.errCode).toBe(expectedErrCode)
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
  USER: {
    INFO: '/api/user/info',
    UPDATE: '/api/user/info',
  },
} as const
