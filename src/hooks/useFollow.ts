import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  followUser, 
  unfollowUser, 
  getUserFollowers, 
  getUserFollowing, 
  isFollowingUser 
} from '../services'

// Hook for checking if following a user
export const useIsFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: () => isFollowingUser(userId),
    select: (data) => data.success ? data.data : false,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook for following a user
export const useFollowUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => {
      // Update the following status cache
      queryClient.setQueryData(['isFollowing', userId], { success: true, data: true })
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] })
    },
    onError: (error) => {
      console.error('Error following user:', error)
    },
  })
}

// Hook for unfollowing a user
export const useUnfollowUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Update the following status cache
      queryClient.setQueryData(['isFollowing', userId], { success: true, data: false })
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
    },
    onError: (error) => {
      console.error('Error unfollowing user:', error)
    },
  })
}

// Hook for getting user followers
export const useUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getUserFollowers(userId),
    select: (data) => data.success ? data.data : [],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting users that a user is following
export const useUserFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getUserFollowing(userId),
    select: (data) => data.success ? data.data : [],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}