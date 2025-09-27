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
    bio: 'Desenvolvedora full-stack apaixonada por ética em IA e código limpo.',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'bob_policy',
    email: 'bob@example.com',
    displayName: 'Bob Smith',
    avatar: '',
    bio: 'Pesquisador de políticas interessado em regulamentação tecnológica.',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: '3',
    username: 'charlie_pm',
    email: 'charlie@example.com',
    displayName: 'Charlie Wilson',
    avatar: '',
    bio: 'Product Manager na TechCorp. Amo organizar eventos em equipe!',
    createdAt: '2023-03-10T09:15:00Z',
  },
  {
    id: '4',
    username: 'diana_designer',
    email: 'diana@example.com',
    displayName: 'Diana Costa',
    avatar: '',
    bio: 'UX/UI Designer focada em acessibilidade e experiências inclusivas.',
    createdAt: '2023-04-05T16:20:00Z',
  },
  {
    id: '5',
    username: 'eduardo_data',
    email: 'eduardo@example.com',
    displayName: 'Eduardo Silva',
    avatar: '',
    bio: 'Cientista de dados explorando machine learning e análise preditiva.',
    createdAt: '2023-05-12T11:35:00Z',
  },
  {
    id: '6',
    username: 'fernanda_security',
    email: 'fernanda@example.com',
    displayName: 'Fernanda Santos',
    avatar: '',
    bio: 'Especialista em cybersecurity e proteção de dados pessoais.',
    createdAt: '2023-06-18T13:40:00Z',
  },
  {
    id: '7',
    username: 'gabriel_startup',
    email: 'gabriel@example.com',
    displayName: 'Gabriel Lima',
    avatar: '',
    bio: 'Empreendedor tech interessado em inovação e sustentabilidade.',
    createdAt: '2023-07-25T08:15:00Z',
  }
]

// Current session - simulate logged in user
let currentUser: User | null = null

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> => {
  await simulateDelay(800) // Simulate network request
  
  // Mock authentication - any email/password works for demo
  // In real implementation, password would be validated
  console.log('Tentativa de login para:', email, 'com tamanho da senha:', password.length)
  
  const user = mockUsers.find(u => u.email === email) || {
    id: Date.now().toString(),
    username: email.split('@')[0],
    email,
    displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    avatar: '',
    bio: 'Bem-vindo ao Rixa!',
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
    message: 'Login realizado com sucesso'
  }
}

export const logout = async (): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  currentUser = null
  
  return {
    data: true,
    success: true,
    message: 'Logout realizado com sucesso'
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
      message: 'Usuário não encontrado'
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
    message: 'Perfil atualizado com sucesso'
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
    message: user ? undefined : 'Usuário não encontrado'
  }
}

export const getRecommendedUsers = async (limit: number = 5): Promise<ApiResponse<User[]>> => {
  await simulateDelay(300)
  
  // If no current user, return some default recommendations
  if (!currentUser) {
    const recommendations = mockUsers.slice(0, limit)
    return {
      data: recommendations,
      success: true,
      message: 'Usuários recomendados carregados'
    }
  }
  
  // Filter out the current user and return random recommendations
  const availableUsers = mockUsers.filter(u => u.id !== currentUser!.id)
  
  // Shuffle and limit the results
  const shuffled = availableUsers.sort(() => 0.5 - Math.random())
  const recommendations = shuffled.slice(0, limit)
  
  return {
    data: recommendations,
    success: true,
    message: 'Usuários recomendados carregados'
  }
}