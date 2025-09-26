import type { CommentData } from '../components/posts/Comment'
import { simulateDelay, type ApiResponse } from './api'

// Mock comment data store
const mockComments: Record<number, CommentData[]> = {
  // Comments for posts
  1: [
    { id: 101, author: "Bob", content: "Great book recommendation! I'll definitely check it out.", timestamp: "1 hour ago", replyCount: 2 },
    { id: 102, author: "Charlie", content: "AI ethics is such an important topic right now.", timestamp: "45 min ago", replyCount: 1 },
    { id: 103, author: "Diana", content: "Which book specifically? I'm always looking for good reads on this topic.", timestamp: "30 min ago", replyCount: 0 }
  ],
  2: [
    { id: 201, author: "Alice", content: "This is exactly the kind of debate we need!", timestamp: "4 hours ago", replyCount: 3 },
    { id: 202, author: "Eve", content: "I'm torn on this issue. Both sides have valid points.", timestamp: "3 hours ago", replyCount: 2 }
  ],
  3: [
    { id: 301, author: "Alice", content: "I vote for sushi! 🍣", timestamp: "20 hours ago", replyCount: 1 },
    { id: 302, author: "Frank", content: "The Italian place has great reviews.", timestamp: "18 hours ago", replyCount: 0 }
  ],
  // Replies to comments
  101: [
    { id: 1001, author: "Alice", content: "I just ordered it! Thanks for the rec.", timestamp: "30 min ago", parentId: 101, replyCount: 0 },
    { id: 1002, author: "ReplyUser", content: "The author's perspective is really unique.", timestamp: "25 min ago", parentId: 101, replyCount: 0 }
  ],
  102: [
    { id: 1003, author: "TechExpert", content: "Especially with all the AI developments lately.", timestamp: "20 min ago", parentId: 102, replyCount: 0 }
  ],
  201: [
    { id: 2001, author: "Bob", content: "Absolutely! More platforms should have these features.", timestamp: "3 hours ago", parentId: 201, replyCount: 0 },
    { id: 2002, author: "PolicyWonk", content: "The regulatory landscape is changing fast.", timestamp: "2 hours ago", parentId: 201, replyCount: 1 },
    { id: 2003, author: "Charlie", content: "We need to balance freedom with responsibility.", timestamp: "1 hour ago", parentId: 201, replyCount: 0 }
  ]
}

export const fetchComments = async (
  postId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<ApiResponse<CommentData[]>> => {
  await simulateDelay(250)
  
  const comments = mockComments[postId] || []
  
  // Simulate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedComments = comments.slice(startIndex, endIndex)
  
  return {
    data: paginatedComments,
    success: true,
    pagination: {
      page,
      limit,
      total: comments.length,
      totalPages: Math.ceil(comments.length / limit)
    }
  }
}

export const createComment = async (
  postId: number, 
  content: string, 
  parentId?: number
): Promise<ApiResponse<CommentData>> => {
  await simulateDelay(350)
  
  const newComment: CommentData = {
    id: Date.now(), // Simple ID generation for mock
    author: "You", // In real app, this would come from auth
    content,
    timestamp: "Just now",
    parentId,
    replyCount: 0
  }
  
  if (!mockComments[postId]) {
    mockComments[postId] = []
  }
  
  mockComments[postId].unshift(newComment)
  
  // Update parent comment reply count if this is a reply
  if (parentId) {
    const updateReplyCount = (comments: CommentData[]) => {
      const parentComment = comments.find(c => c.id === parentId)
      if (parentComment) {
        parentComment.replyCount = (parentComment.replyCount || 0) + 1
      }
    }
    
    // Search in all comment arrays for the parent
    Object.values(mockComments).forEach(updateReplyCount)
  }
  
  return {
    data: newComment,
    success: true,
    message: 'Comment added successfully'
  }
}

export const deleteComment = async (commentId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  // Find and remove comment from mock data
  for (const postId in mockComments) {
    const index = mockComments[postId].findIndex(c => c.id === commentId)
    if (index !== -1) {
      mockComments[postId].splice(index, 1)
      return {
        data: true,
        success: true,
        message: 'Comment deleted successfully'
      }
    }
  }
  
  return {
    data: false,
    success: false,
    message: 'Comment not found'
  }
}

export const likeComment = async (commentId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(150)
  
  // Mock like functionality - in real app would update like count
  // Using commentId for future implementation
  console.log('Liking comment:', commentId)
  
  return {
    data: true,
    success: true,
    message: 'Comment liked'
  }
}