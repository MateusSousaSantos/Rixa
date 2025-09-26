import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPosts, 
  searchPosts, 
  createPost, 
  voteInPoll, 
  voteInDebate
} from '../services/postService';
import type { PostType } from '../components/posts/index';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  search: (query: string) => [...postKeys.all, 'search', query] as const,
};

// Fetch posts hook
export const usePosts = (
  page: number = 1,
  limit: number = 10,
  sortBy: 'newest' | 'popular' | 'trending' = 'newest'
) => {
  return useQuery({
    queryKey: postKeys.list({ page, limit, sortBy }),
    queryFn: () => fetchPosts(page, limit, sortBy),
    select: (data) => data.success ? data.data : [],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search posts hook
export const useSearchPosts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: postKeys.search(query),
    queryFn: () => searchPosts(query),
    select: (data) => data.success ? data.data : [],
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: Omit<PostType, 'id' | 'timestamp'>) => createPost(newPost),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate and refetch posts
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        
        // Optimistically add to cache
        queryClient.setQueryData(
          postKeys.list({ page: 1, limit: 10, sortBy: 'newest' }),
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
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });
};

// Vote in poll mutation
export const useVoteInPoll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, optionId }: { postId: number; optionId: number }) => 
      voteInPoll(postId, optionId),
    onSuccess: () => {
      // Invalidate posts to refetch updated vote counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
    onError: (error) => {
      console.error('Error voting in poll:', error);
    },
  });
};

// Vote in debate mutation
export const useVoteInDebate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, side }: { postId: number; side: 'pro' | 'con' }) => 
      voteInDebate(postId, side),
    onSuccess: () => {
      // Invalidate posts to refetch updated vote counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
    onError: (error) => {
      console.error('Error voting in debate:', error);
    },
  });
};