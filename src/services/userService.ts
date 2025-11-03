import type { User } from '../types/user'
import { 
  API_BASE_URL, 
  type ApiResponse, 
  handleApiError, 
  handleHttpError,
  createSuccessResponse,
  createErrorResponse
} from './api'
import { fetchWithAuth } from '../utils/authInterceptor'

// Configuração da API do seu backend Java

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        senha: password
      })
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const data = await response.json();
    
    if (data.success) {
      // Mapear do formato Java para formato React
      return createSuccessResponse({
        user: {
          id: data.user.id.toString(),      // Converter number para string
          username: data.user.username,
          email: data.user.email,
          nome: data.user.nome,      // Mapear 'nome' para 'displayName'
          avatar: data.user.avatar || '',
          bios: data.user.bios || data.user.bio || 'Usuário do Rixa',           // Valor padrão
          followerCount: data.user.followerCount || 0,
          followingCount: data.user.followingCount || 0,
        },
        token: data.token
      }, data.message);
    } else {
      return createErrorResponse(data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão com o servidor'));
  }
}

export const logout = async (): Promise<ApiResponse<boolean>> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      }
    });

    // Mesmo se der erro no servidor, faz logout local
    return createSuccessResponse(true, 'Logout realizado com sucesso');
  } catch (error) {
    // Em caso de erro de conexão, ainda faz logout local
    console.error('Erro no logout:', error);
    return createSuccessResponse(true, 'Logout realizado (offline)');
  }
}

export const updateProfile = async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const getCurrentUser = localStorage.getItem('rixa_user');
    if (!getCurrentUser) {
      return createErrorResponse('Usuário não autenticado');
    }
    // Mapear do formato React para formato Java
    const javaUserData = {
      username: profileData.username,
      nome: profileData.nome,
      bios: profileData.bios,  
    };
    console.log('Dados enviados para atualização:', javaUserData);

    const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: javaUserData.username,
        nome: javaUserData.nome,
        bios: javaUserData.bios,
      })
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const data = await response.json();
    
    if (data.success) {
      const userResponse = await getProfile();
      if (userResponse.success && userResponse.data) {
        return createSuccessResponse(userResponse.data, 'Perfil atualizado com sucesso');
      } else {
        return createErrorResponse('Falha ao recuperar dados atualizados do usuário');
      }
    } else {
      return createErrorResponse('Falha ao atualizar perfil');
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}

export const getProfile = async (): Promise<ApiResponse<User | null>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw handleHttpError(response);
    }

    const user = await response.json();
    
    if (user && user.id) {
      return createSuccessResponse({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        nome: user.nome,
        avatar: user.avatar || '',
        bios: user.bios || user.bio || 'Usuário do Rixa',
        followerCount: user.followerCount || 0,
        followingCount: user.followingCount || 0,
      });
    } else {
      return createSuccessResponse(null, 'Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'), null);
  }
}

// Manter funções mock para outras funcionalidades por enquanto
export const getCurrentUser = async (): Promise<ApiResponse<User | null>> => {
  // Esta função será chamada pelo contexto na inicialização
  const storedUser = localStorage.getItem('rixa_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return createSuccessResponse(user);
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      return createSuccessResponse(null);
    }
  }
  return createSuccessResponse(null);
}

export const getMostFollowedUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/most-followed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const usersData = await response.json();

    if (Array.isArray(usersData)) {
      const formattedUsers = usersData.map(user => ({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        nome: user.nome,
        avatar: user.avatar || '',
        bios: user.bios || user.bio || 'Usuário do Rixa',
        followerCount: user.followerCount || 0,
        followingCount: user.followingCount || 0,
      }));

      return createSuccessResponse(formattedUsers);
    } else {
      return createSuccessResponse([]);
    }
  } catch (error) {
    console.error('Erro ao buscar usuários mais seguidos:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'), []);
  }
}

export const searchUsers = async (query: string): Promise<ApiResponse<User[]>> => {
  // Por enquanto retorna array vazio - pode implementar depois
  console.log('Buscando usuários com query:', query);
  return createSuccessResponse([]);
}

export const getUserByUsername = async (username: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/usuario/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const userData = await response.json();
    console.log('Dados do usuário recebido:', userData);
    if (userData && userData.id) {
      return createSuccessResponse({
        id: userData.id.toString(),
        username: userData.username,
        email: userData.email,
        nome: userData.nome,
        avatar: userData.avatar || '',
        bios: userData.bios || userData.bio || 'Usuário do Rixa',
        followerCount: userData.followerCount || 0,
        followingCount: userData.followingCount || 0,
      });
    } else {
      return createErrorResponse('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar usuário por username:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}

export const getUserById = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const userData = await response.json();

    if (userData && userData.id) {
      return createSuccessResponse({
        id: userData.id.toString(),
        username: userData.username,
        email: userData.email,
        nome: userData.nome,
        avatar: userData.avatar || '',
        bios: userData.bios || userData.bio || 'Usuário do Rixa',
        followerCount: userData.followerCount || 0,
        followingCount: userData.followingCount || 0,
      });
    } else {
      return createErrorResponse('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}

export const followUser = async (username: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const segundoUsernameNoArroba = username.startsWith('@') ? username.slice(1) : username;
    console.log('Seguindo usuário:', segundoUsernameNoArroba);
    const response = await fetchWithAuth(`${API_BASE_URL}/seguir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seguindoUsername: segundoUsernameNoArroba.trim()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return createErrorResponse(data.message || 'Falha ao seguir usuário');
    }

    return createSuccessResponse(data, 'Usuário seguido com sucesso');
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}

export const unfollowUser = async (username: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const usernameSemArroba = username.startsWith('@') ? username.slice(1) : username;
    console.log('Deixando de seguir usuário:', usernameSemArroba);
    
    const response = await fetchWithAuth(`${API_BASE_URL}/seguir`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seguindoUsername: usernameSemArroba.trim()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return createErrorResponse(data.message || 'Falha ao deixar de seguir usuário');
    }

    return createSuccessResponse(data, 'Usuário deixado de seguir com sucesso');
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}

export const isFollowingUser = async (username: string): Promise<ApiResponse<{ isFollowing: boolean }>> => {
  try {
    const segundoUsernameNoArroba = username.startsWith('@') ? username.slice(1) : username;
    
    const response = await fetchWithAuth(`${API_BASE_URL}/seguir/is-following/${segundoUsernameNoArroba.trim()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw handleHttpError(response);
    }

    const data = await response.json();
    
    return createSuccessResponse({ isFollowing: data.isFollowing || false });
  } catch (error) {
    console.error('Erro ao verificar se está seguindo usuário:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'), { isFollowing: false });
  }
}

export const register = async (name: string, username: string, email: string, password: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: '',
        nome: name,
        username: username, 
        email: email,
        senha: password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return createErrorResponse(data.message || 'Falha no registro');
    }

    return createSuccessResponse(data, 'Registro realizado com sucesso');
  } catch (error) {
    console.error('💥 userService - Erro na requisição:', error);
    return createErrorResponse(handleApiError(error, 'Erro de conexão'));
  }
}