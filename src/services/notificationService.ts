import { simulateDelay, type ApiResponse } from './api'

// Notification types
export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
  userId: string
}

// Mock notification storage
const mockNotifications: Record<string, Notification[]> = {}

export const getNotifications = async (
  userId: string, 
  page: number = 1, 
  limit: number = 20
): Promise<ApiResponse<Notification[]>> => {
  await simulateDelay(200)
  
  const userNotifications = mockNotifications[userId] || []
  
  // Sort by creation date (newest first)
  const sortedNotifications = userNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedNotifications = sortedNotifications.slice(startIndex, endIndex)
  
  return {
    data: paginatedNotifications,
    success: true,
    pagination: {
      page,
      limit,
      total: userNotifications.length,
      totalPages: Math.ceil(userNotifications.length / limit)
    }
  }
}

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(100)
  
  // Find notification across all users
  for (const userId in mockNotifications) {
    const notification = mockNotifications[userId].find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      return {
        data: true,
        success: true,
        message: 'Notificação marcada como lida'
      }
    }
  }
  
  return {
    data: false,
    success: false,
    message: 'Notificação não encontrada'
  }
}

export const markAllNotificationsAsRead = async (userId: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(150)
  
  const userNotifications = mockNotifications[userId] || []
  userNotifications.forEach(notification => {
    notification.read = true
  })
  
  return {
    data: true,
    success: true,
    message: 'Todas as notificações marcadas como lidas'
  }
}

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<ApiResponse<Notification>> => {
  await simulateDelay(50)
  
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  
  if (!mockNotifications[notification.userId]) {
    mockNotifications[notification.userId] = []
  }
  
  mockNotifications[notification.userId].unshift(newNotification)
  
  return {
    data: newNotification,
    success: true,
    message: 'Notificação criada'
  }
}

export const getUnreadNotificationCount = async (userId: string): Promise<ApiResponse<number>> => {
  await simulateDelay(50)
  
  const userNotifications = mockNotifications[userId] || []
  const unreadCount = userNotifications.filter(n => !n.read).length
  
  return {
    data: unreadCount,
    success: true
  }
}

export const deleteNotification = async (notificationId: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(100)
  
  for (const userId in mockNotifications) {
    const index = mockNotifications[userId].findIndex(n => n.id === notificationId)
    if (index !== -1) {
      mockNotifications[userId].splice(index, 1)
      return {
        data: true,
        success: true,
        message: 'Notificação deletada'
      }
    }
  }
  
  return {
    data: false,
    success: false,
    message: 'Notificação não encontrada'
  }
}

// Helper functions to create specific types of notifications
export const createLikeNotification = async (postId: number, likerUserId: string, postAuthorId: string) => {
  if (likerUserId === postAuthorId) return // Don't notify user of their own likes
  
  return createNotification({
    type: 'like',
    title: 'Nova curtida',
    message: 'Alguém curtiu seu post',
    data: { postId, likerUserId },
    read: false,
    userId: postAuthorId
  })
}

export const createCommentNotification = async (postId: number, commenterUserId: string, postAuthorId: string) => {
  if (commenterUserId === postAuthorId) return // Don't notify user of their own comments
  
  return createNotification({
    type: 'comment',
    title: 'Novo comentário',
    message: 'Alguém comentou em seu post',
    data: { postId, commenterUserId },
    read: false,
    userId: postAuthorId
  })
}

export const createFollowNotification = async (followerUserId: string, followedUserId: string) => {
  return createNotification({
    type: 'follow',
    title: 'Novo seguidor',
    message: 'Alguém começou a te seguir',
    data: { followerUserId },
    read: false,
    userId: followedUserId
  })
}