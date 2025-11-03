// Auth interceptor for handling unauthorized responses
interface AuthInterceptorCallbacks {
  onUnauthorized: () => void
}

let authCallbacks: AuthInterceptorCallbacks | null = null

// Register the callbacks for handling unauthorized responses
export const registerAuthInterceptor = (callbacks: AuthInterceptorCallbacks) => {
  authCallbacks = callbacks
}

// Unregister the callbacks (useful for cleanup)
export const unregisterAuthInterceptor = () => {
  authCallbacks = null
}

// Handle unauthorized response - this will be called by API services
export const handleUnauthorizedResponse = () => {
  if (authCallbacks?.onUnauthorized) {
    console.log('🔒 Unauthorized response detected - logging out user')
    authCallbacks.onUnauthorized()
  }
}

// Enhanced fetch function that includes auth handling
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get token from localStorage
  const token = localStorage.getItem('rixa_token')
  
  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  // Handle unauthorized responses
  if (response.status === 401) {
    handleUnauthorizedResponse()
  }

  return response
}