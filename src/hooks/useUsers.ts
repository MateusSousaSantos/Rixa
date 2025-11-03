import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMostFollowedUsers, 
  followUser, 
  unfollowUser, 
  isFollowingUser
} from '../services/userService';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (username: string) => [...userKeys.details(), username] as const,
  following: (username: string) => [...userKeys.all, 'following', username] as const,
  mostFollowed: () => [...userKeys.all, 'most-followed'] as const,
};

// Get most followed users hook
export const useMostFollowedUsers = (limit: number = 4) => {
  return useQuery({
    queryKey: userKeys.mostFollowed(),
    queryFn: getMostFollowedUsers,
    select: (data) => {
      if (data.success && data.data) {
        return data.data.slice(0, limit);
      }
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Check if following user hook
export const useIsFollowingUser = (username: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.following(username),
    queryFn: () => isFollowingUser(username),
    select: (data) => data.success ? data.data?.isFollowing || false : false,
    enabled: enabled && username.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Follow user mutation
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (username: string) => followUser(username),
    onSuccess: (_, username) => {
      // Update the following status in cache
      queryClient.setQueryData(
        userKeys.following(username),
        { success: true, data: { isFollowing: true } }
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.mostFollowed() });
    },
    onError: (error) => {
      console.error('Error following user:', error);
    },
  });
};

// Unfollow user mutation
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (username: string) => unfollowUser(username),
    onSuccess: (_, username) => {
      // Update the following status in cache
      queryClient.setQueryData(
        userKeys.following(username),
        { success: true, data: { isFollowing: false } }
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.mostFollowed() });
    },
    onError: (error) => {
      console.error('Error unfollowing user:', error);
    },
  });
};