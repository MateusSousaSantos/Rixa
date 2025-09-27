import { simulateDelay, type ApiResponse } from './api'

// User settings interface
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    mentions: boolean
    likes: boolean
    comments: boolean
    follows: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private'
    showEmail: boolean
    showActivity: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    language: string
  }
  content: {
    autoplayVideos: boolean
    showSensitiveContent: boolean
  }
}

// Default settings
const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    mentions: true,
    likes: true,
    comments: true,
    follows: true
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true
  },
  appearance: {
    theme: 'dark',
    language: 'pt-BR'
  },
  content: {
    autoplayVideos: true,
    showSensitiveContent: false
  }
}

// Mock settings storage
const mockUserSettings: Record<string, UserSettings> = {}

export const getUserSettings = async (userId: string): Promise<ApiResponse<UserSettings>> => {
  await simulateDelay(150)
  
  const userSettings = mockUserSettings[userId] || { ...defaultSettings }
  
  // Store default settings if user doesn't have any
  if (!mockUserSettings[userId]) {
    mockUserSettings[userId] = userSettings
  }
  
  return {
    data: userSettings,
    success: true,
    message: 'Configurações carregadas'
  }
}

export const updateUserSettings = async (
  userId: string, 
  settings: Partial<UserSettings>
): Promise<ApiResponse<UserSettings>> => {
  await simulateDelay(200)
  
  // Get current settings or use defaults
  const currentSettings = mockUserSettings[userId] || { ...defaultSettings }
  
  // Deep merge the settings
  const updatedSettings: UserSettings = {
    notifications: { ...currentSettings.notifications, ...settings.notifications },
    privacy: { ...currentSettings.privacy, ...settings.privacy },
    appearance: { ...currentSettings.appearance, ...settings.appearance },
    content: { ...currentSettings.content, ...settings.content }
  }
  
  mockUserSettings[userId] = updatedSettings
  
  return {
    data: updatedSettings,
    success: true,
    message: 'Configurações atualizadas com sucesso'
  }
}

export const resetUserSettings = async (userId: string): Promise<ApiResponse<UserSettings>> => {
  await simulateDelay(150)
  
  const resetSettings = { ...defaultSettings }
  mockUserSettings[userId] = resetSettings
  
  return {
    data: resetSettings,
    success: true,
    message: 'Configurações resetadas para o padrão'
  }
}

// Individual setting update functions for convenience
export const updateNotificationSettings = async (
  userId: string, 
  notifications: Partial<UserSettings['notifications']>
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(100)
  
  const currentSettings = mockUserSettings[userId] || { ...defaultSettings }
  currentSettings.notifications = { ...currentSettings.notifications, ...notifications }
  mockUserSettings[userId] = currentSettings
  
  return {
    data: true,
    success: true,
    message: 'Configurações de notificação atualizadas'
  }
}

export const updatePrivacySettings = async (
  userId: string, 
  privacy: Partial<UserSettings['privacy']>
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(100)
  
  const currentSettings = mockUserSettings[userId] || { ...defaultSettings }
  currentSettings.privacy = { ...currentSettings.privacy, ...privacy }
  mockUserSettings[userId] = currentSettings
  
  return {
    data: true,
    success: true,
    message: 'Configurações de privacidade atualizadas'
  }
}

export const updateAppearanceSettings = async (
  userId: string, 
  appearance: Partial<UserSettings['appearance']>
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(100)
  
  const currentSettings = mockUserSettings[userId] || { ...defaultSettings }
  currentSettings.appearance = { ...currentSettings.appearance, ...appearance }
  mockUserSettings[userId] = currentSettings
  
  return {
    data: true,
    success: true,
    message: 'Configurações de aparência atualizadas'
  }
}

// Account security related functions
export const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(300)
  
  // Mock password validation
  if (currentPassword.length < 6 || newPassword.length < 6) {
    return {
      data: false,
      success: false,
      message: 'Senha deve ter pelo menos 6 caracteres'
    }
  }
  
  // In real implementation, would validate current password and hash new one
  console.log(`Password changed for user ${userId}`)
  
  return {
    data: true,
    success: true,
    message: 'Senha alterada com sucesso'
  }
}

export const requestPasswordReset = async (email: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(400)
  
  // Mock sending password reset email
  console.log(`Password reset requested for email: ${email}`)
  
  return {
    data: true,
    success: true,
    message: 'Email de recuperação enviado'
  }
}

export const verifyEmail = async (token: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  // Mock email verification
  console.log(`Email verification attempted with token: ${token}`)
  
  // Simple token validation for mock
  if (token.length < 10) {
    return {
      data: false,
      success: false,
      message: 'Token inválido'
    }
  }
  
  return {
    data: true,
    success: true,
    message: 'Email verificado com sucesso'
  }
}