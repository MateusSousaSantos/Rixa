import { useQuery } from '@tanstack/react-query'
import { getRecommendedUsers } from '../services'

export const useRecommendedUsers = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recommendedUsers', limit],
    queryFn: async () => {
      const response = await getRecommendedUsers(limit)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch recommended users')
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}