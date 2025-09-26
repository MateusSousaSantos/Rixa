import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, createComment } from '../services/commentService';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: number, page?: number) => [...commentKeys.lists(), { postId, page }] as const,
  replies: () => [...commentKeys.all, 'replies'] as const,
  reply: (commentId: number, page?: number) => [...commentKeys.replies(), { commentId, page }] as const,
};

// Fetch comments for a post
export const useComments = (
  postId: number,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: commentKeys.list(postId, page),
    queryFn: () => fetchComments(postId, page, limit),
    select: (data) => data.success ? data.data : [],
    enabled: enabled && postId > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Fetch replies for a comment (using fetchComments with commentId as postId for replies)
export const useCommentReplies = (
  commentId: number,
  page: number = 1,
  limit: number = 5,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: commentKeys.reply(commentId, page),
    queryFn: () => fetchComments(commentId, page, limit), // Using fetchComments for replies too
    select: (data) => data.success ? data.data : [],
    enabled: enabled && commentId > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, content, parentId }: { 
      postId: number; 
      content: string; 
      parentId?: number;
    }) => createComment(postId, content, parentId),
    onSuccess: (response, variables) => {
      if (response.success) {
        if (variables.parentId) {
          // If it's a reply, invalidate the replies for that comment
          queryClient.invalidateQueries({ 
            queryKey: commentKeys.reply(variables.parentId) 
          });
        } else {
          // If it's a top-level comment, invalidate comments for that post
          queryClient.invalidateQueries({ 
            queryKey: commentKeys.list(variables.postId) 
          });
          
          // Optimistically add to cache
          queryClient.setQueryData(
            commentKeys.list(variables.postId, 1),
            (oldData: any) => {
              if (oldData?.success) {
                return {
                  ...oldData,
                  data: [response.data, ...oldData.data]
                };
              }
              return oldData;
            }
          );
        }
      }
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
    },
  });
};

// Prefetch comments for a post (useful for hover states)
export const usePrefetchComments = () => {
  const queryClient = useQueryClient();
  
  return (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: commentKeys.list(postId, 1),
      queryFn: () => fetchComments(postId, 1, 10),
      staleTime: 3 * 60 * 1000,
    });
  };
};