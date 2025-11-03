// Environment configuration helper
// Centralized access to environment variables with type safety

interface AppConfig {
  // API Configuration
  apiUrl: string
  
  // App Information
  appName: string
  appVersion: string
  
  // Feature Flags
  enableMockApi: boolean
  enableDebug: boolean
  enableDebates: boolean
  
  // Limits
  maxPostLength: number
  maxCommentLength: number
  
  // Development
  mockDelay: number
  isDevelopment: boolean
  isProduction: boolean
}

// Environment variable getter with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback
}

const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = import.meta.env[key]
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

const getEnvNumber = (key: string, fallback: number = 0): number => {
  const value = import.meta.env[key]
  if (value === undefined) return fallback
  const num = parseInt(value, 10)
  return isNaN(num) ? fallback : num
}

// Main configuration object
export const appConfig: AppConfig = {
  // API Configuration
  apiUrl: getEnvVar('VITE_APP_API_URL', 'http://localhost:8080'),
  
  // App Information
  appName: getEnvVar('VITE_APP_NAME', 'Rixa'),
  appVersion: getEnvVar('VITE_APP_VERSION', '0.1.0'),
  
  // Feature Flags
  enableMockApi: getEnvBool('VITE_APP_ENABLE_MOCK_API', true),
  enableDebug: getEnvBool('VITE_APP_ENABLE_DEBUG', import.meta.env.DEV),
  enableDebates: getEnvBool('VITE_APP_ENABLE_DEBATES', true),
  
  // Limits
  maxPostLength: getEnvNumber('VITE_APP_MAX_POST_LENGTH', 280),
  maxCommentLength: getEnvNumber('VITE_APP_MAX_COMMENT_LENGTH', 200),
  
  // Development
  mockDelay: getEnvNumber('VITE_APP_MOCK_DELAY', import.meta.env.DEV ? 500 : 0),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}

// Debug logging in development
if (appConfig.enableDebug) {
  console.log('🔧 App Configuration:', appConfig)
}

export default appConfig