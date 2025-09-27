export type { User, AuthState } from './user'
export type { NavigationView, PostDetailsState, UserProfileState } from './navigation'

// Additional types for new services
export interface SignupData {
  username: string
  email: string
  password: string
  displayName: string
}

export interface FileUpload {
  file: File
  type: 'image' | 'video' | 'avatar'
}

export interface SearchFilters {
  type?: 'normal' | 'debate' | 'pool'
  author?: string
  dateRange?: {
    start: string
    end: string
  }
  hashtags?: string[]
}