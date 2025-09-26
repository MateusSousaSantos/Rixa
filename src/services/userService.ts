import type { User } from '../types/user'
import { simulateDelay, type ApiResponse } from './api'

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    username: 'alice_dev',
    email: 'alice@example.com',
    displayName: 'Alice Johnson',
    avatar: '',
    bio: 'Full-stack developer passionate about AI ethics and clean code.',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'bob_policy',
    email: 'bob@example.com',
    displayName: 'Bob Smith',
    avatar: '',
    bio: 'Policy researcher interested in technology regulation.',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: '3',
    username: 'charlie_pm',
    email: 'charlie@example.com',
    displayName: 'Charlie Wilson',
    avatar: '',
    bio: 'Product Manager at TechCorp. Love organizing team events!',
    createdAt: '2023-03-10T09:15:00Z',
  }
]

// Current session - simulate logged in user
let currentUser: User | null = null

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> => {
  await simulateDelay(800) // Simulate network request
  
  // Mock authentication - any email/password works for demo
  // In real implementation, password would be validated
  console.log('Login attempt for:', email, 'with password length:', password.length)
  
  const user = mockUsers.find(u => u.email === email) || {
    id: Date.now().toString(),
    username: email.split('@')[0],
    email,
    displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    avatar: '',
    bio: 'Welcome to Rixa!',
    createdAt: new Date().toISOString(),
  }
  
  // Add to mock users if new
  if (!mockUsers.find(u => u.email === email)) {
    mockUsers.push(user)
  }
  
  currentUser = user
  
  return {
    data: {
      user,
      token: `mock_token_${user.id}_${Date.now()}`
    },
    success: true,
    message: 'Login successful'
  }
}

export const logout = async (): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  currentUser = null
  
  return {
    data: true,
    success: true,
    message: 'Logged out successfully'
  }
}

export const getCurrentUser = async (): Promise<ApiResponse<User | null>> => {
  await simulateDelay(100)
  
  return {
    data: currentUser,
    success: true
  }
}

export const updateProfile = async (userId: string, profileData: Partial<User>): Promise<ApiResponse<User>> => {
  await simulateDelay(400)
  
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    return {
      data: null as any,
      success: false,
      message: 'User not found'
    }
  }
  
  const updatedUser = { ...mockUsers[userIndex], ...profileData }
  mockUsers[userIndex] = updatedUser
  
  if (currentUser && currentUser.id === userId) {
    currentUser = updatedUser
  }
  
  return {
    data: updatedUser,
    success: true,
    message: 'Profile updated successfully'
  }
}

export const searchUsers = async (query: string): Promise<ApiResponse<User[]>> => {
  await simulateDelay(300)
  
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.displayName.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  )
  
  return {
    data: filteredUsers,
    success: true
  }
}

export const getUserById = async (userId: string): Promise<ApiResponse<User | null>> => {
  await simulateDelay(200)
  
  const user = mockUsers.find(u => u.id === userId)
  
  return {
    data: user || null,
    success: !!user,
    message: user ? undefined : 'User not found'
  }
}