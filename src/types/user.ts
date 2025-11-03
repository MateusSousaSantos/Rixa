export interface User {
  id: string
  username: string
  email: string
  nome: string
  avatar?: string
  bios?: string
  followerCount?: number
  followingCount?: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}