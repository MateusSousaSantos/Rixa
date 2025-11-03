import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPosts, 
  fetchPostById,
  searchPosts, 
  createPost, 
  voteInDebate,
  toggleLikePost,
  searchPostsByHashtag,
  fetchTrendingPosts,
  fetchTrendingHashtags,
  fetchPostsByUser
} from '../services/postService';

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
    queryFn: () => {
      // Use different endpoints based on sort type
      if (sortBy === 'trending') {
        return fetchTrendingPosts();
      }
      return fetchPosts(page, limit, sortBy);
    },
    select: (data) => data.success ? data.data : [],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Fetch single post by ID hook
export const usePost = (postId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => fetchPostById(postId),
    select: (data) => data.success ? data.data : null,
    enabled: enabled && postId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search posts hook (handles both regular search and hashtag search)
export const useSearchPosts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: postKeys.search(query),
    queryFn: () => {
      // Use hashtag search if query starts with #
      if (query.startsWith('#')) {
        return searchPostsByHashtag(query);
      }
      // Use user posts if query starts with @
      if (query.startsWith('@')) {
        return searchPosts(query);
      }
      return searchPosts(query);
    },
    select: (data) => data.success ? data.data : [],
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
    retry: 1, // Only retry once for search queries
  });
};

// Fetch posts by user hook
export const usePostsByUser = (username: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...postKeys.all, 'user', username],
    queryFn: () => fetchPostsByUser(username),
    select: (data) => data.success ? data.data : [],
    enabled: enabled && username.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: {
      content: string;
      type: 'normal' | 'debate';
      midia?: string | null;
      post_pai_id?: number | null;
      debate_id?: number | null;
    }) => createPost(newPost),
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

// Like/Unlike post mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: number) => toggleLikePost(postId),
    onSuccess: () => {
      // Invalidate posts to refetch updated like counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    },
  });
};

// Fetch trending posts hook
export const useTrendingPosts = () => {
  return useQuery({
    queryKey: [...postKeys.all, 'trending'],
    queryFn: fetchTrendingPosts,
    select: (data) => data.success ? data.data : [],
    staleTime: 10 * 60 * 1000, // 10 minutes for trending posts
  });
};

// Fetch trending hashtags hook
export const useTrendingHashtags = () => {
  return useQuery({
    queryKey: [...postKeys.all, 'trending-hashtags'],
    queryFn: fetchTrendingHashtags,
    select: (data) => data.success ? data.data : [],
    staleTime: 15 * 60 * 1000, // 15 minutes for trending hashtags
  });
};