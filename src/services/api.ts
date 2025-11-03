// Base API configuration and utilities
import { appConfig } from '../config/env'
import { fetchWithAuth, handleUnauthorizedResponse } from '../utils/authInterceptor'

export const API_BASE_URL = appConfig.apiUrl

// Simulate network delay for realistic testing
// const simulateDelay = (ms: number = 500): Promise<void> => 
//   new Promise(resolve => setTimeout(resolve, ms))

const simulateDelay = (ms: number = appConfig.mockDelay): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

// Mock API response wrapper
interface ApiResponse<T> {
  data: T | null
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error handling
export class ApiError extends Error {
  public status: number
  public code?: string
  
  constructor(
    message: string, 
    status: number = 500,
    code?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Standardized error response handler
export const handleApiError = (error: any, defaultMessage: string = 'Erro de conexão com o servidor'): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return defaultMessage
}

// Standardized HTTP error handler
export const handleHttpError = (response: Response): ApiError => {
  const statusMessages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autorizado - faça login novamente',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    409: 'Conflito - recurso já existe',
    422: 'Dados inválidos',
    500: 'Erro interno do servidor',
    502: 'Serviço temporariamente indisponível',
    503: 'Serviço indisponível'
  }
  
  const message = statusMessages[response.status] || `Erro HTTP: ${response.status}`
  const error = new ApiError(message, response.status)
  
  // Handle unauthorized responses through the interceptor
  if (response.status === 401) {
    handleUnauthorizedResponse()
  }
  
  return error
}

// Generic API request function with standardized error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    // Handle backend response format
    if (data.success !== undefined) {
      return {
        data: data.success ? data.data || data : null,
        success: data.success,
        message: data.message
      }
    }
    
    // Direct data response
    return {
      data: data,
      success: true
    }
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    
    if (error instanceof ApiError) {
      return {
        data: null,
        success: false,
        message: error.message
      }
    }
    
    return {
      data: null,
      success: false,
      message: handleApiError(error)
    }
  }
}

// Utility for creating consistent success responses
export const createSuccessResponse = <T>(
  data: T, 
  message?: string,
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
): ApiResponse<T> => ({
  data,
  success: true,
  message,
  pagination
})

// Utility for creating consistent error responses
export const createErrorResponse = <T = null>(
  message: string, 
  data: T = null as T
): ApiResponse<T> => ({
  data,
  success: false,
  message
})

export const makeHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}

export { simulateDelay }
export type { ApiResponse }