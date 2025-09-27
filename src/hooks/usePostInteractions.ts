import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost, sharePost, reportPost } from '../services'

// Hook for liking posts
export const useLikePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (postId: number) => likePost(postId),
    onSuccess: () => {
      // Invalidate posts to refetch updated like counts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('Error liking post:', error)
    },
  })
}

// Hook for sharing posts
export const useSharePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (postId: number) => sharePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('Error sharing post:', error)
    },
  })
}

// Hook for reporting posts
export const useReportPost = () => {
  return useMutation({
    mutationFn: ({ postId, reason }: { postId: number; reason: string }) => 
      reportPost(postId, reason),
    onError: (error) => {
      console.error('Error reporting post:', error)
    },
  })
}