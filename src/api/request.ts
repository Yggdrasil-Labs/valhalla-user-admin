import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import axios from 'axios'
import { env } from '@/config/env'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    console.log('请求发送:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    })

    return config
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    console.log('响应接收:', {
      url: response.config.url,
      status: response.status,
      data,
    })

    // 统一处理响应数据
    if (data.code === 200 || data.success === true) {
      return response
    }
    else {
      // 业务错误处理
      const errorMessage = data.message || '请求失败'
      console.error('业务错误:', errorMessage)

      // 可以在这里添加全局错误提示
      // ElMessage.error(errorMessage)

      return Promise.reject(new Error(errorMessage))
    }
  },
  (error: AxiosError) => {
    console.error('响应拦截器错误:', error)

    let errorMessage = '网络错误，请稍后重试'

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          errorMessage = '未授权，请重新登录'
          // 可以在这里添加跳转到登录页的逻辑
          // router.push('/login')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = (data as any)?.message || `请求失败 (${status})`
      }
    }
    else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
    }
    else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时'
    }

    // 可以在这里添加全局错误提示
    // ElMessage.error(errorMessage)

    return Promise.reject(new Error(errorMessage))
  },
)

export default request
