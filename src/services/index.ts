// Export all services from a central location
export * from './api'
export * from './postService'
export * from './commentService'
export * from './userService'

// Import centralized config
import { appConfig } from '../config/env'

// Service configuration
export const serviceConfig = {
  apiBaseUrl: appConfig.apiUrl,
  timeout: 10000,
  retryAttempts: 3,
  enableMocking: appConfig.enableMockApi
}