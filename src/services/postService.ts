import type { PostType } from '../components/posts/index'
import { simulateDelay, type ApiResponse } from './api'

const mockPosts: PostType[] = [
  {
    id: 1,
    author: "Alice",
    content: "Acabei de terminar de ler um livro incrível sobre ética em IA! A interseção entre tecnologia e filosofia é fascinante.",
    timestamp: "2 horas atrás",
    type: "normal",
  },
  {
    id: 2,
    author: "Bob",
    content: "O que vocês acham sobre as novas regulamentações de redes sociais?",
    timestamp: "5 horas atrás",
    type: "debate",
    topic: "Regulamentações de Redes Sociais: Proteção Necessária ou Exagero?",
    sides: {
      pro: { 
        votes: 87, 
        arguments: ["Melhor proteção da privacidade", "Redução de desinformação", "Protege usuários vulneráveis"], 
        name: "Proteção Necessária" 
      },
      con: { 
        votes: 63, 
        arguments: ["Limita a liberdade de expressão", "Excesso governamental", "Sufoca a inovação"], 
        name: "Exagero" 
      }
    }
  },
  {
    id: 3,
    author: "Charlie",
    content: "Para onde devemos ir no próximo almoço da equipe? Vamos decidir juntos!",
    timestamp: "1 dia atrás",
    type: "pool",
    question: "Melhor lugar para almoçar em equipe?",
    options: [
      { id: 1, text: "Restaurante Italiano do Centro", votes: 23 },
      { id: 2, text: "Sushi Bar da Rua Principal", votes: 31 },
      { id: 3, text: "Food Truck Mexicano", votes: 15 },
      { id: 4, text: "Saladeria Saudável", votes: 8 }
    ]
  },
  {
    id: 4,
    author: "Diana",
    content: "O debate sobre mudanças climáticas está esquentando novamente. O que vocês acham das últimas propostas de políticas?",
    timestamp: "3 horas atrás",
    type: "debate",
    topic: "Política Climática: Ação Agressiva vs Equilíbrio Econômico",
    sides: {
      pro: { 
        votes: 5056, 
        arguments: ["Ação urgente é necessária", "Futuras gerações dependem de nós", "Benefícios econômicos da tecnologia verde"], 
        name: "Ação Agressiva" 
      },
      con: { 
        votes: 98, 
        arguments: ["Precisamos de estabilidade econômica", "Transição gradual é melhor", "Preocupações com o mercado de trabalho"], 
        name: "Equilíbrio Econômico" 
      }
    }
  },
  {
    id: 5,
    author: "Eve",
    content: "Qual framework de programação devemos usar no próximo projeto?",
    timestamp: "6 horas atrás",
    type: "pool",
    question: "Melhor framework para nosso projeto web?",
    options: [
      { id: 1, text: "React com TypeScript", votes: 45 },
      { id: 2, text: "Vue.js 3", votes: 28 },
      { id: 3, text: "Angular", votes: 19 },
      { id: 4, text: "Svelte", votes: 12 }
    ]
  },
  {
    id: 6,
    author: "Frank",
    content: "Acabei de tomar o café mais incrível na nova cafeteria do centro. O barista realmente conhece seu ofício!",
    timestamp: "30 minutos atrás",
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
        sortedPosts.sort(() => Math.random() - 0.5) 
        break
      case 'popular':
        sortedPosts.sort(() => Math.random() - 0.5) 
        break
      case 'trending':
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
    throw new Error('Falha ao buscar posts')
  }
}

export const fetchPostById = async (id: number): Promise<ApiResponse<PostType | null>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === id)
  return {
    data: post || null,
    success: !!post,
    message: post ? undefined : 'Post não encontrado'
  }
}

export const createPost = async (postData: Omit<PostType, 'id' | 'timestamp'>): Promise<ApiResponse<PostType>> => {
  await simulateDelay(400)
  
  const newPost: PostType = {
    ...postData,
    id: Math.max(...mockPosts.map(p => p.id)) + 1,
    timestamp: 'Just now'
  } as PostType
  
  mockPosts.unshift(newPost)
  
  return {
    data: newPost,
    success: true,
    message: 'Post criado com sucesso'
  }
}

export const deletePost = async (id: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(300)
  
  const index = mockPosts.findIndex(p => p.id === id)
  if (index === -1) {
    return {
      data: false,
      success: false,
      message: 'Post não encontrado'
    }
  }
  
  mockPosts.splice(index, 1)
  return {
    data: true,
    success: true,
    message: 'Post deletado com sucesso'
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
      message: 'Enquete não encontrada'
    }
  }
  
  const option = post.options?.find((opt: any) => opt.id === optionId)
  if (!option) {
    return {
      data: false,
      success: false,
      message: 'Opção não encontrada'
    }
  }
  
  option.votes += 1
  
  return {
    data: true,
    success: true,
    message: 'Voto registrado com sucesso'
  }
}

export const voteInDebate = async (postId: number, side: 'pro' | 'con'): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post || post.type !== 'debate') {
    return {
      data: false,
      success: false,
      message: 'Debate não encontrado'
    }
  }
  
  if (post.sides) {
    post.sides[side].votes += 1
  }
  
  return {
    data: true,
    success: true,
    message: 'Voto registrado com sucesso'
  }
}

// Post Interaction Services
export const likePost = async (postId: number): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> => {
  await simulateDelay(150)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post) {
    return {
      data: { liked: false, likeCount: 0 },
      success: false,
      message: 'Post não encontrado'
    }
  }
  
  // Mock like functionality - toggle like status
  const currentLikes = (post as any).likes || 0
  const isLiked = (post as any).isLiked || false
  
  ;(post as any).likes = isLiked ? currentLikes - 1 : currentLikes + 1
  ;(post as any).isLiked = !isLiked
  
  return {
    data: {
      liked: (post as any).isLiked,
      likeCount: (post as any).likes
    },
    success: true,
    message: (post as any).isLiked ? 'Post curtido' : 'Curtida removida'
  }
}

export const sharePost = async (postId: number): Promise<ApiResponse<boolean>> => {
  await simulateDelay(200)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post) {
    return {
      data: false,
      success: false,
      message: 'Post não encontrado'
    }
  }
  
  // Mock share functionality
  const currentShares = (post as any).shares || 0
  ;(post as any).shares = currentShares + 1
  
  return {
    data: true,
    success: true,
    message: 'Post compartilhado com sucesso'
  }
}

export const reportPost = async (postId: number, reason: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(300)
  
  const post = mockPosts.find(p => p.id === postId)
  if (!post) {
    return {
      data: false,
      success: false,
      message: 'Post não encontrado'
    }
  }
  
  // Mock report functionality
  console.log(`Post ${postId} reportado por: ${reason}`)
  
  return {
    data: true,
    success: true,
    message: 'Post reportado com sucesso'
  }
}