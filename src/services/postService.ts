import type { PostType, DebatePost, NormalPost } from '../components/posts/index'
import { 
  API_BASE_URL,
  type ApiResponse, 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError,
  handleHttpError
} from './api'
import { fetchWithAuth } from '../utils/authInterceptor'
import { mapBackendPostToFrontend, mapMultipleBackendPosts } from '../utils/postMapper'

// Real API service functions based on Postman collection

// Get Feed (with authentication for personalized feed)
export const fetchPosts = async (
  page: number = 1, 
  limit: number = 10,
  _sortBy: 'newest' | 'popular' | 'trending' = 'newest' // TODO: Implement sorting in backend
): Promise<ApiResponse<PostType[]>> => {
  try {
    // Note: _sortBy parameter not yet implemented in backend API
    const offset = (page - 1) * limit
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/feed?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (Array.isArray(data)) {
      // Use the new robust mapping function
      const posts: PostType[] = mapMultipleBackendPosts(data)
      
      return createSuccessResponse(posts, undefined, {
        page,
        limit,
        total: data.length, // Backend should provide total count
        totalPages: Math.ceil(data.length / limit)
      })
    } else {
      return createSuccessResponse([])
    }
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao buscar posts'))
  }
}

// Get Post by ID
export const fetchPostById = async (id: number): Promise<ApiResponse<PostType | null>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/search/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return createSuccessResponse(null, 'Post não encontrado')
      }
      throw handleHttpError(response)
    }

    const data = await response.json()
    console.log('Backend data:', data)
    const post = mapBackendPostToFrontend(data)
    console.log('Mapped post:', post)
    return createSuccessResponse(post)
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao buscar post'))
  }
}

// Create Post
export const createPost = async (postData: {
  content: string
  type: 'normal' | 'debate'
  midia?: string | null
  post_pai_id?: number | null
  debate_id?: number | null
}): Promise<ApiResponse<PostType>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conteudo: postData.content,
        midia: postData.midia || null,
        tipo_post: postData.type,
        post_pai_id: postData.post_pai_id || null,
        debate_id: postData.debate_id || null
      })
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (data.success) {
      // If backend returns the post ID, fetch the created post
      if (data.postId || data.id) {
        const postId = data.postId || data.id
        const fetchResult = await fetchPostById(postId)
        if (fetchResult.success && fetchResult.data) {
          return createSuccessResponse(fetchResult.data, 'Post criado com sucesso')
        }
      }
      
      // If no post ID is returned, create a mock post object for immediate UI update
      let mockPost: PostType
      
      if (postData.type === 'debate') {
        mockPost = {
          id: Date.now(), // Temporary ID until real refresh
          nomeAutor: 'Você', // This should be replaced with actual user data
          username: 'current-user', // This should be replaced with actual username
          conteudo: postData.content,
          data_criacao: 'Agora mesmo',
          likesCount: 0,
          isLiked: false,
          commentCount: 0,
          tipo_post: 'debate',
          topic: 'Debate',
          sides: {
            pro: { votes: 0, arguments: [], name: 'A favor' },
            con: { votes: 0, arguments: [], name: 'Contra' }
          }
        } as DebatePost
      } else {
        mockPost = {
          id: Date.now(), // Temporary ID until real refresh
          nomeAutor: 'Você', // This should be replaced with actual user data
          username: 'current-user', // This should be replaced with actual username
          conteudo: postData.content,
          data_criacao: 'Agora mesmo',
          likesCount: 0,
          isLiked: false,
          commentCount: 0,
          tipo_post: 'normal'
        } as NormalPost
      }
      
      return createSuccessResponse(mockPost, 'Post criado com sucesso')
    } else {
      return createErrorResponse(data.message || 'Falha ao criar post')
    }
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao criar post'))
  }
}

// Update Post
export const updatePost = async (postData: {
  id: number
  content: string
  type: 'normal' | 'debate'
  midia?: string | null
}): Promise<ApiResponse<PostType>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/atualizar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postData.id,
        conteudo: postData.content,
        midia: postData.midia || null,
        tipo_post: postData.type
      })
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (data.success) {
      const post = mapBackendPostToFrontend(data.post || data.data)
      return createSuccessResponse(post, 'Post atualizado com sucesso')
    } else {
      return createErrorResponse(data.message || 'Falha ao atualizar post')
    }
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao atualizar post'))
  }
}

// Delete Post
export const deletePost = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    return createSuccessResponse(true, 'Post deletado com sucesso')
  } catch (error) {
    console.error('Erro ao deletar post:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao deletar post'))
  }
}

// Like/Unlike Post
export const toggleLikePost = async (postId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/curtir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId
      })
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    console.log(data)
    return createSuccessResponse(true, data.message || 'Like/unlike registrado com sucesso')
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao curtir/descurtir post'))
  }
}

// Get Posts by User
export const fetchPostsByUser = async (username: string): Promise<ApiResponse<PostType[]>> => {
  try {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/usuario/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (Array.isArray(data)) {
      const posts: PostType[] = mapMultipleBackendPosts(data)
      return createSuccessResponse(posts)
    } else {
      return createSuccessResponse([])
    }
  } catch (error) {
    console.error('Erro ao buscar posts do usuário:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao buscar posts do usuário'))
  }
}

// Search Posts by Hashtag
export const searchPostsByHashtag = async (
  hashtag: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PostType[]>> => {
  try {
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag
    const offset = (page - 1) * limit
    
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/hashtag/${cleanHashtag}?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (Array.isArray(data)) {
      const posts: PostType[] = mapMultipleBackendPosts(data)
      return createSuccessResponse(posts)
    } else {
      return createSuccessResponse([])
    }
  } catch (error) {
    console.error('Erro ao buscar posts por hashtag:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao buscar posts por hashtag'))
  }
}

// Legacy function for compatibility - enhanced to handle various search types
export const searchPosts = async (
  query: string, 
  filters?: { type?: PostType['tipo_post'], author?: string }
): Promise<ApiResponse<PostType[]>> => {
  const trimmedQuery = query.trim()
  
  // If query is empty, return empty results
  if (!trimmedQuery) {
    return createSuccessResponse([])
  }
  
  // If query starts with #, use hashtag search
  if (trimmedQuery.startsWith('#')) {
    return searchPostsByHashtag(trimmedQuery)
  }
  
  // If query starts with @, search by user (if implemented in backend)
  if (trimmedQuery.startsWith('@')) {
    const username = trimmedQuery.slice(1)
    if (username) {
      return fetchPostsByUser(username)
    }
  }
  
  // For general content search, you could implement backend text search here
  // For now, return empty results for non-hashtag/non-user searches
  console.log('Buscando posts com query:', trimmedQuery, 'filters:', filters)
  return createSuccessResponse([], 'Busca por conteúdo não implementada ainda')
}

// Get Trending Posts (public endpoint mentioned in Postman collection)
export const fetchTrendingPosts = async (): Promise<ApiResponse<PostType[]>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/trending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()
    
    if (Array.isArray(data)) {
      const posts: PostType[] = mapMultipleBackendPosts(data)
      return createSuccessResponse(posts)
    } else {
      return createSuccessResponse([])
    }
  } catch (error) {
    console.error('Erro ao buscar posts em alta:', error)
    return createErrorResponse(handleApiError(error, 'Falha ao buscar posts em alta'))
  }
}

export const voteInDebate = async (postId: number, side: 'pro' | 'con'): Promise<ApiResponse<boolean>> => {
  // This would need to be implemented based on your backend's debate voting endpoint
  // For now, returning a placeholder
  console.log('Voting in debate:', postId, 'side:', side)
  return createErrorResponse('Funcionalidade de votação em debate não implementada ainda')
}

// Get Trending Hashtags (new endpoint)
export const fetchTrendingHashtags = async (): Promise<ApiResponse<{ tag: string; posts: number }[]>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/tendencias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw handleHttpError(response)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      const hashtags: { tag: string; posts: number }[] = data.map((item: any) => ({
        tag: `#${item.nome || ''}`,
        posts: item.posts_count || 0
      }))
      return createSuccessResponse(hashtags)
    } else {

      return createSuccessResponse([])
    }
  } catch (error) {
    console.error('Erro ao buscar hashtags em alta:', error)
    // Return mock data on error
    return createSuccessResponse([], 'Usando dados de exemplo')
  }
}