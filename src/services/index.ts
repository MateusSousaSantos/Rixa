// Export all services from a central location
export * from './api'
export * from './postService'
export * from './commentService'
export * from './userService'

// Service configuration
export const serviceConfig = {
  apiBaseUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retryAttempts: 3,
  enableMocking: import.meta.env.DEV || !import.meta.env.VITE_APP_API_URL
}