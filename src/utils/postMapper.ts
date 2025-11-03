// Data transformation utilities following industry best practices
// Separates data transformation logic from service logic

import type { PostType, DebatePost, NormalPost } from '../components/Posts/index'

// Type-safe mapping function with comprehensive field handling
export const mapBackendPostToFrontend = (backendPost: any): PostType => {
  // Validate required fields
  if (!backendPost || !backendPost.id) {
    throw new Error('Invalid backend post data: missing required id field')
  }

  // Create base post with proper field mapping
  const basePost = {
    id: Number(backendPost.id),
    // Use nomeAutor from backend, fallback to username if nomeAutor is empty/null
    nomeAutor: backendPost.nomeAutor?.trim() || backendPost.username || backendPost.author || 'Unknown',
    // Preserve username for navigation purposes
    username: backendPost.username || backendPost.nomeAutor?.trim() || 'unknown',
    conteudo: backendPost.conteudo || backendPost.content || '',
    // Keep original ISO timestamp for data integrity
    data_criacao: backendPost.data_criacao || backendPost.timestamp || new Date().toISOString(),
    tipo_post: (backendPost.tipo_post || backendPost.type || 'normal') as 'normal' | 'debate',
    
    // Handle numeric fields with proper null checking
    likesCount: Number(backendPost.likesCount ?? backendPost.likes ?? backendPost.curtidas ?? 0),
    commentCount: Number(backendPost.comentariosCount ?? backendPost.commentCount ?? backendPost.total_comentarios ?? 0),
    
    // Handle boolean fields properly
    isLiked: Boolean(backendPost.usuarioLikeu ?? backendPost.isLiked ?? backendPost.user_curtiu ?? false),
    
    // Optional fields - preserve empty strings as they are valid values
    avatarAutor: backendPost.avatarAutor ?? backendPost.avatar_autor ?? backendPost.avatar,
    hashTags: backendPost.hashtags ?? backendPost.hashTags ?? backendPost.hash_tags,
  }

  // Type-specific mapping
  switch (basePost.tipo_post) {
    case 'debate':
      return {
        ...basePost,
        topic: backendPost.topico || backendPost.topic || 'Debate',
        sides: {
          pro: {
            votes: Number(backendPost.pro_votes ?? 0),
            arguments: Array.isArray(backendPost.pro_arguments) ? backendPost.pro_arguments : [],
            name: backendPost.pro_name || 'A favor'
          },
          con: {
            votes: Number(backendPost.con_votes ?? 0),
            arguments: Array.isArray(backendPost.con_arguments) ? backendPost.con_arguments : [],
            name: backendPost.con_name || 'Contra'
          }
        }
      } as DebatePost

    default:
      return basePost as NormalPost
  }
}

// Validation function for backend data
export const validateBackendPost = (data: any): boolean => {
  return data && 
         typeof data.id !== 'undefined' && 
         typeof data.conteudo === 'string' &&
         (data.tipo_post === 'normal' || data.tipo_post === 'debate')
}

// Batch mapping with error handling
export const mapMultipleBackendPosts = (backendPosts: any[]): PostType[] => {
  if (!Array.isArray(backendPosts)) {
    console.warn('Expected array of posts, received:', typeof backendPosts)
    return []
  }

  return backendPosts
    .filter(validateBackendPost)
    .map(post => {
      try {
        return mapBackendPostToFrontend(post)
      } catch (error) {
        console.error('Failed to map post:', post, error)
        return null
      }
    })
    .filter((post): post is PostType => post !== null)
}