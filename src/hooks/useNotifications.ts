import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification 
} from '../services'

// Query keys for notifications
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: string, page?: number) => [...notificationKeys.lists(), { userId, page }] as const,
  unreadCount: (userId: string) => [...notificationKeys.all, 'unreadCount', userId] as const,
}

// Hook for getting user notifications
export const useNotifications = (
  userId: string,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: notificationKeys.list(userId, page),
    queryFn: () => getNotifications(userId, page, limit),
    select: (data) => data.success ? data.data : [],
    enabled: enabled && !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hook for getting unread notification count
export const useUnreadNotificationCount = (userId: string) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId),
    queryFn: () => getUnreadNotificationCount(userId),
    select: (data) => data.success ? data.data : 0,
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// Hook for marking notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications to refetch updated read status
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error)
    },
  })
}

// Hook for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: (_, userId) => {
      // Update unread count to 0
      queryClient.setQueryData(notificationKeys.unreadCount(userId), { success: true, data: 0 })
      
      // Invalidate notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Error marking all notifications as read:', error)
    },
  })
}

// Hook for deleting notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error: any) => {
      console.error('Error deleting notification:', error)
    },
  })
}