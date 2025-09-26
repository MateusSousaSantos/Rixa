import type { PostType } from '../components/posts/index'
import { simulateDelay, type ApiResponse } from './api'

// Mock data store
const mockPosts: PostType[] = [
  {
    id: 1,
    author: "Alice",
    content: "Just finished reading an amazing book about AI ethics! The intersection of technology and philosophy is fascinating.",
    timestamp: "2 hours ago",
    type: "normal",
  },
  {
    id: 2,
    author: "Bob",
    content: "What do you think about the new social media regulations?",
    timestamp: "5 hours ago",
    type: "debate",
    topic: "Social Media Regulations: Necessary Protection or Overreach?",
    sides: {
      pro: { 
        votes: 87, 
        arguments: ["Better privacy protection", "Reduced misinformation", "Protects vulnerable users"], 
        name: "Necessary Protection" 
      },
      con: { 
        votes: 63, 
        arguments: ["Limits free speech", "Government overreach", "Stifles innovation"], 
        name: "Overreach" 
      }
    }
  },
  {
    id: 3,
    author: "Charlie",
    content: "Where should we go for our next team lunch? Let's decide together!",
    timestamp: "1 day ago",
    type: "pool",
    question: "Best lunch spot for team meeting?",
    options: [
      { id: 1, text: "Italian Restaurant Downtown", votes: 23 },
      { id: 2, text: "Sushi Bar on Main St", votes: 31 },
      { id: 3, text: "Mexican Grill (Food Truck)", votes: 15 },
      { id: 4, text: "Healthy Salad Bar", votes: 8 }
    ]
  },
  {
    id: 4,
    author: "Diana",
    content: "Climate change debate is heating up again. What are your thoughts on the latest policy proposals?",
    timestamp: "3 hours ago",
    type: "debate",
    topic: "Climate Policy: Aggressive Action vs Economic Balance",
    sides: {
      pro: { 
        votes: 156, 
        arguments: ["Urgent action needed", "Future generations depend on us", "Economic benefits of green tech"], 
        name: "Aggressive Action" 
      },
      con: { 
        votes: 98, 
        arguments: ["Need economic stability", "Gradual transition is better", "Job market concerns"], 
        name: "Economic Balance" 
      }
    }
  },
  {
    id: 5,
    author: "Eve",
    content: "Which programming framework should we use for our next project?",
    timestamp: "6 hours ago",
    type: "pool",
    question: "Best framework for our web project?",
    options: [
      { id: 1, text: "React with TypeScript", votes: 45 },
      { id: 2, text: "Vue.js 3", votes: 28 },
      { id: 3, text: "Angular", votes: 19 },
      { id: 4, text: "Svelte", votes: 12 }
    ]
  },
  {
    id: 6,
    author: "Frank",
    content: "Just had the most amazing coffee at the new café downtown. Their barista really knows their craft!",
    timestamp: "30 minutes ago",
    type: "normal",
  }
]

// Service functions
export const fetchPosts = async (
  page: number = 1, 
  limit: number = 10,
  sortBy: 'newest' | 'popular' | 'trending' = 'newest'
): Promise<ApiResponse<PostType[]>> => {
  await simulateDelay(300)
  
  try {
    // Simulate sorting
    let sortedPosts = [...mockPosts]
    
    switch (sortBy) {
      case 'newest':
        // Mock timestamp sorting - in real app would parse actual timestamps
        sortedPosts.sort(() => Math.random() - 0.5) 
        break
      case 'popular':
        // Sort by engagement (likes + comments - mock calculation)
        sortedPosts.sort(() => Math.random() - 0.5) 
        break
      case 'trending':
        // Sort by recent activity - mock calculation
        sortedPosts.sort(() => Math.random() - 0.5) 
        break
    }
    
    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex)
    
    return {
      data: paginatedPosts,
      success: true,
      pagination: {
        page,
        limit,
        total: mockPosts.length,
        totalPages: Math.ceil(mockPosts.length / limit)
      }
    }
  } catch (error) {
    throw new Error('Failed to fetch posts')
  }
}

export const fetchPostById = async (id: number): Promise<ApiResponse<PostType | null>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === id)
  return {
    data: post || null,
    success: !!post,
    message: post ? undefined : 'Post not found'
  }
}

export const createPost = async (postData: Omit<PostType, 'id' | 'timestamp'>): Promise<ApiResponse<PostType>> => {
  await simulateDelay(400)
  
  const newPost: PostType = {
    ...postData,
    id: Math.max(...mockPosts.map(p => p.id)) + 1,
    timestamp: 'Just now'
  }
  
  mockPosts.unshift(newPost)
  
  return {
    data: newPost,
    success: true,
    message: 'Post created successfully'
  }
}

export const deletePost = async (id: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(300)
  
  const index = mockPosts.findIndex(p => p.id === id)
  if (index === -1) {
    return {
      data: false,
      success: false,
      message: 'Post not found'
    }
  }
  
  mockPosts.splice(index, 1)
  return {
    data: true,
    success: true,
    message: 'Post deleted successfully'
  }
}

export const searchPosts = async (
  query: string, 
  filters?: { type?: PostType['type'], author?: string }
): Promise<ApiResponse<PostType[]>> => {
  await simulateDelay(400)
  
  let filteredPosts = mockPosts.filter(post => 
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.author.toLowerCase().includes(query.toLowerCase())
  )
  
  if (filters?.type) {
    filteredPosts = filteredPosts.filter(post => post.type === filters.type)
  }
  
  if (filters?.author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.toLowerCase().includes(filters.author!.toLowerCase())
    )
  }
  
  return {
    data: filteredPosts,
    success: true
  }
}

export const voteInPoll = async (postId: number, optionId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post || post.type !== 'pool') {
    return {
      data: false,
      success: false,
      message: 'Poll not found'
    }
  }
  
  const option = post.options?.find(opt => opt.id === optionId)
  if (!option) {
    return {
      data: false,
      success: false,
      message: 'Option not found'
    }
  }
  
  option.votes += 1
  
  return {
    data: true,
    success: true,
    message: 'Vote recorded successfully'
  }
}

export const voteInDebate = async (postId: number, side: 'pro' | 'con'): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post || post.type !== 'debate') {
    return {
      data: false,
      success: false,
      message: 'Debate not found'
    }
  }
  
  if (post.sides) {
    post.sides[side].votes += 1
  }
  
  return {
    data: true,
    success: true,
    message: 'Vote recorded successfully'
  }
}