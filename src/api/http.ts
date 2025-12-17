import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import request from './request'

// HTTP方法封装类
class Http {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.get(url, { params, ...config })
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.post(url, data, config)
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.put(url, data, config)
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param config 请求配置
   */
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.delete(url, config)
  }

  /**
   * PATCH请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.patch(url, data, config)
  }

  /**
   * HEAD请求
   * @param url 请求地址
   * @param config 请求配置
   */
  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.head(url, config)
  }

  /**
   * OPTIONS请求
   * @param url 请求地址
   * @param config 请求配置
   */
  options<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.options(url, config)
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param file 文件对象
   * @param onProgress 上传进度回调
   * @param config 请求配置
   */
  upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
      ...config,
    })
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param filename 文件名
   * @param config 请求配置
   */
  download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    return request.get(url, {
      responseType: 'blob',
      ...config,
    }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  /**
   * 并发请求
   * @param requests 请求数组
   */
  all<T = any>(requests: Array<Promise<ApiResponse<T>>>): Promise<ApiResponse<T>[]> {
    return Promise.all(requests)
  }

  /**
   * 并发请求（有一个成功就返回）
   * @param requests 请求数组
   */
  race<T = any>(requests: Array<Promise<ApiResponse<T>>>): Promise<ApiResponse<T>> {
    return Promise.race(requests)
  }

  /**
   * 并发请求（所有请求都完成，无论成功失败）
   * @param requests 请求数组
   */
  allSettled<T = any>(requests: Array<Promise<ApiResponse<T>>>): Promise<PromiseSettledResult<ApiResponse<T>>[]> {
    return Promise.allSettled(requests)
  }
}

// 创建实例
const http = new Http()

// 导出实例和类
export default http
export { Http }

// 导出类型
export type { ApiResponse }
