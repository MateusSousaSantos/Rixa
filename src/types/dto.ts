// Data Transfer Objects for API responses
// This follows industry standard for type-safe API communication

export interface BackendPostResponse {
  id: number;
  conteudo: string;
  midia: string | null;
  username: string;
  nomeAutor: string;
  avatarAutor: string;
  comentariosCount: number;
  data_criacao: string;
  debate_id: number | null;
  hashtags: Array<{
    id: number;
    nome: string;
    data_criacao: string;
  }>;
  likesCount: number;
  post_pai_id: number | null;
  tipo_post: "normal" | "debate";
  usuarioLikeu: boolean | null;
  usuario_id: number;
}

export interface BackendDebatePostResponse extends BackendPostResponse {
  tipo_post: "debate";
  topico?: string;
  pro_votes?: number;
  con_votes?: number;
  pro_arguments?: string[];
  con_arguments?: string[];
}

// Utility type for flexible backend responses
export type FlexibleBackendPost = Partial<BackendPostResponse> & {
  id: number; // Always required
  tipo_post: "normal" | "debate";
}