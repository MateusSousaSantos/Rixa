export interface BasePost {
  id: number;
  nomeAutor: string;
  username: string;
  conteudo: string;
  data_criacao: string;
  tipo_post: "normal" | "debate";
  likesCount?: number;
  avatarAutor?: string;
  isLiked?: boolean;
  commentCount?: number;
  hashTags?: { id: number; nome: string; data_criacao: string }[];
}

export interface NormalPost extends BasePost {
  tipo_post: "normal";
}

export interface DebatePost extends BasePost {
  tipo_post: "debate";
  topic: string;
  sides: {
    pro: { votes: number; arguments: string[]; name?: string };
    con: { votes: number; arguments: string[]; name?: string };
  };
}

export type PostType = NormalPost | DebatePost;

// Export comment types
export type { CommentData } from './Comment';
export { Comment } from './Comment';