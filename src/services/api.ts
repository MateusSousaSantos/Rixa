// Base API configuration and utilities
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api'

// Simulate network delay for realistic testing
const simulateDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock API response wrapper
interface ApiResponse<T> {
  data: T
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

// Generic API request function (for future real implementation)
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // This will be replaced with actual fetch logic later
  // Using endpoint and options parameters when implementing real API
  console.log('Requisição API para:', endpoint, 'com opções:', options)
  throw new Error('API real ainda não implementada')
}

export { simulateDelay }
export type { ApiResponse }