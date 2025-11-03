import type { CommentData } from '../components/posts/Comment'
import { 
  simulateDelay, 
  type ApiResponse, 
  createSuccessResponse, 
  createErrorResponse 
} from './api'

// Mock comment data store
const mockComments: Record<number, CommentData[]> = {
  // Comments for posts
  1: [
    { id: 101, author: "Bob", content: "Ótima recomendação de livro! Com certeza vou dar uma olhada.", timestamp: "1 hora atrás", replyCount: 2 },
    { id: 102, author: "Charlie", content: "Ética em IA é um tópico tão importante agora.", timestamp: "45 min atrás", replyCount: 1 },
    { id: 103, author: "Diana", content: "Qual livro especificamente? Sempre procuro boas leituras sobre esse tópico.", timestamp: "30 min atrás", replyCount: 0 }
  ],
  2: [
    { id: 201, author: "Alice", content: "Esse é exatamente o tipo de debate que precisamos!", timestamp: "4 horas atrás", replyCount: 3 },
    { id: 202, author: "Eve", content: "Estou dividida nessa questão. Ambos os lados têm pontos válidos.", timestamp: "3 horas atrás", replyCount: 2 }
  ],
  3: [
    { id: 301, author: "Alice", content: "Eu voto no sushi! 🍣", timestamp: "20 horas atrás", replyCount: 1 },
    { id: 302, author: "Frank", content: "O restaurante italiano tem ótimas avaliações.", timestamp: "18 horas atrás", replyCount: 0 }
  ],
  // Replies to comments
  101: [
    { id: 1001, author: "Alice", content: "Acabei de encomendar! Obrigada pela recomendação.", timestamp: "30 min atrás", parentId: 101, replyCount: 0 },
    { id: 1002, author: "ReplyUser", content: "A perspectiva do autor é realmente única.", timestamp: "25 min atrás", parentId: 101, replyCount: 0 }
  ],
  102: [
    { id: 1003, author: "TechExpert", content: "Especialmente com todos os desenvolvimentos em IA ultimamente.", timestamp: "20 min atrás", parentId: 102, replyCount: 0 }
  ],
  201: [
    { id: 2001, author: "Bob", content: "Absolutamente! Mais plataformas deveriam ter essas funcionalidades.", timestamp: "3 horas atrás", parentId: 201, replyCount: 0 },
    { id: 2002, author: "PolicyWonk", content: "O cenário regulatório está mudando rapidamente.", timestamp: "2 horas atrás", parentId: 201, replyCount: 1 },
    { id: 2003, author: "Charlie", content: "Precisamos equilibrar liberdade com responsabilidade.", timestamp: "1 hora atrás", parentId: 201, replyCount: 0 }
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
  
  return createSuccessResponse(paginatedComments, undefined, {
    page,
    limit,
    total: comments.length,
    totalPages: Math.ceil(comments.length / limit)
  });
}

export const createComment = async (
  postId: number, 
  content: string, 
  parentId?: number
): Promise<ApiResponse<CommentData>> => {
  await simulateDelay(350)
  
  const newComment: CommentData = {
    id: Date.now(), // Simple ID generation for mock
    author: "Você", // In real app, this would come from auth
    content,
    timestamp: "Agora mesmo",
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
  
  return createSuccessResponse(newComment, 'Comentário adicionado com sucesso');
}

export const deleteComment = async (commentId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  // Find and remove comment from mock data
  for (const postId in mockComments) {
    const index = mockComments[postId].findIndex(c => c.id === commentId)
    if (index !== -1) {
      mockComments[postId].splice(index, 1)
      return createSuccessResponse(true, 'Comentário deletado com sucesso');
    }
  }
  
  return createErrorResponse('Comentário não encontrado');
}

export const likeComment = async (commentId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(150)
  
  // Mock like functionality - in real app would update like count
  // Using commentId for future implementation
  console.log('Curtindo comentário:', commentId)
  
  return createSuccessResponse(true, 'Comentário curtido');
}