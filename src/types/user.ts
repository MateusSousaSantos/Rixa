export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}