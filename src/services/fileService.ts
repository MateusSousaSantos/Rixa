import { simulateDelay, type ApiResponse } from './api'

// Mock file upload service
export const uploadImage = async (file: File): Promise<ApiResponse<{ url: string; id: string }>> => {
  await simulateDelay(800) // Simulate upload time
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      data: { url: '', id: '' },
      success: false,
      message: 'Apenas imagens são permitidas'
    }
  }
  
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      data: { url: '', id: '' },
      success: false,
      message: 'Imagem muito grande. Máximo 5MB'
    }
  }
  
  // Mock upload - in real implementation would upload to cloud storage
  const mockUrl = URL.createObjectURL(file)
  const fileId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    data: {
      url: mockUrl,
      id: fileId
    },
    success: true,
    message: 'Imagem enviada com sucesso'
  }
}

export const uploadVideo = async (file: File): Promise<ApiResponse<{ url: string; id: string }>> => {
  await simulateDelay(1200) // Simulate longer upload time for video
  
  // Validate file type
  if (!file.type.startsWith('video/')) {
    return {
      data: { url: '', id: '' },
      success: false,
      message: 'Apenas vídeos são permitidos'
    }
  }
  
  // Validate file size (50MB limit)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      data: { url: '', id: '' },
      success: false,
      message: 'Vídeo muito grande. Máximo 50MB'
    }
  }
  
  // Mock upload
  const mockUrl = URL.createObjectURL(file)
  const fileId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    data: {
      url: mockUrl,
      id: fileId
    },
    success: true,
    message: 'Vídeo enviado com sucesso'
  }
}

export const uploadAvatar = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  await simulateDelay(500)
  
  if (!file.type.startsWith('image/')) {
    return {
      data: { url: '' },
      success: false,
      message: 'Apenas imagens são permitidas para avatar'
    }
  }
  
  // Smaller size limit for avatars (2MB)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    return {
      data: { url: '' },
      success: false,
      message: 'Imagem muito grande. Máximo 2MB para avatar'
    }
  }
  
  const mockUrl = URL.createObjectURL(file)
  
  return {
    data: { url: mockUrl },
    success: true,
    message: 'Avatar atualizado com sucesso'
  }
}

export const deleteFile = async (fileId: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  // Mock delete - in real implementation would delete from cloud storage
  console.log(`Deleting file: ${fileId}`)
  
  return {
    data: true,
    success: true,
    message: 'Arquivo deletado com sucesso'
  }
}