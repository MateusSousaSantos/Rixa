import { simulateDelay, type ApiResponse } from './api'

// Trending hashtag interface
export interface TrendingTag {
  tag: string
  posts: number
  growth: number // percentage growth
}

// Mock trending hashtags data
const mockTrendingTags: TrendingTag[] = [
  { tag: '#TechNews', posts: 1234, growth: 15.3 },
  { tag: '#DebateNoite', posts: 892, growth: 8.7 },
  { tag: '#EnqueteDoDia', posts: 567, growth: 22.1 },
  { tag: '#Política2024', posts: 445, growth: -2.3 },
  { tag: '#Música', posts: 332, growth: 12.8 },
  { tag: '#Esportes', posts: 298, growth: 5.4 },
  { tag: '#Cinema', posts: 267, growth: 9.2 },
  { tag: '#Livros', posts: 201, growth: 18.6 },
]

export const getTrendingHashtags = async (limit: number = 8): Promise<ApiResponse<TrendingTag[]>> => {
  await simulateDelay(200)
  
  // Sort by post count and apply some randomization for realistic trending
  const trending = [...mockTrendingTags]
    .sort((a, b) => b.posts - a.posts)
    .slice(0, limit)
    .map(tag => ({
      ...tag,
      // Add some variation to post counts
      posts: tag.posts + Math.floor(Math.random() * 20) - 10
    }))
  
  return {
    data: trending,
    success: true,
    message: 'Hashtags em alta carregadas'
  }
}

export const searchHashtags = async (query: string): Promise<ApiResponse<TrendingTag[]>> => {
  await simulateDelay(150)
  
  const filteredTags = mockTrendingTags.filter(tag => 
    tag.tag.toLowerCase().includes(query.toLowerCase())
  )
  
  return {
    data: filteredTags,
    success: true,
    message: 'Hashtags encontradas'
  }
}

// Mock personalized content algorithm
export const getPersonalizedFeed = async (
  userId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<ApiResponse<{ posts: any[]; interests: string[] }>> => {
  await simulateDelay(400)
  
  // This would implement a real recommendation algorithm
  // For now, return posts with some personalization logic
  
  // Mock user interests based on userId
  const userInterests = getUserInterests(userId)
  
  // Filter and score posts based on interests
  // For mock purposes, just return empty array - would fetch from postService with scoring
  const personalizedPosts: any[] = []
  
  // Use page and limit for pagination in real implementation
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  console.log(`Fetching personalized feed for user ${userId}, page ${page}, limit ${limit}`)
  console.log(`User interests:`, userInterests)
  
  return {
    data: {
      posts: personalizedPosts.slice(startIndex, endIndex),
      interests: userInterests
    },
    success: true,
    message: 'Feed personalizado carregado'
  }
}

// Helper function to mock user interests
const getUserInterests = (_userId: string): string[] => {
  // Mock interest extraction based on user behavior
  const interests = [
    ['tech', 'programming', 'ai'],
    ['politics', 'debate', 'news'],
    ['music', 'art', 'culture'],
    ['sports', 'fitness', 'health']
  ]
  
  // Return random interests for demo
  return interests[Math.floor(Math.random() * interests.length)]
}

export const updateUserInterests = async (userId: string, interests: string[]): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  // Mock updating user interests for personalization
  console.log(`Updated interests for user ${userId}:`, interests)
  
  return {
    data: true,
    success: true,
    message: 'Interesses atualizados com sucesso'
  }
}