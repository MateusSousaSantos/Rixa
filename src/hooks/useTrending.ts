import { useQuery } from '@tanstack/react-query'
import { getTrendingHashtags, searchHashtags } from '../services'

// Query keys for trending content
export const trendingKeys = {
  all: ['trending'] as const,
  hashtags: () => [...trendingKeys.all, 'hashtags'] as const,
  hashtagSearch: (query: string) => [...trendingKeys.hashtags(), 'search', query] as const,
}

// Hook for getting trending hashtags
export const useTrendingHashtags = (limit: number = 8) => {
  return useQuery({
    queryKey: [...trendingKeys.hashtags(), { limit }],
    queryFn: () => getTrendingHashtags(limit),
    select: (data) => data.success ? data.data : [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for searching hashtags
export const useSearchHashtags = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: trendingKeys.hashtagSearch(query),
    queryFn: () => searchHashtags(query),
    select: (data) => data.success ? data.data : [],
    enabled: enabled && query.trim().length > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}