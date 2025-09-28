export interface BasePost {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  type: "normal" | "debate" | "pool";
}

export interface NormalPost extends BasePost {
  type: "normal";
}

export interface DebatePost extends BasePost {
  type: "debate";
  topic: string;
  sides: {
    pro: { votes: number; arguments: string[]; name?: string };
    con: { votes: number; arguments: string[]; name?: string };
  };
}

export interface PoolPost extends BasePost {
  type: "pool";
  question: string;
  options: Array<{
    id: number;
    text: string;
    votes: number;
  }>;
}

export type PostType = NormalPost | DebatePost | PoolPost;

// Export comment types
export type { CommentData } from './Comment';
export { Comment } from './Comment';

// Export share functionality
export { ShareButton } from './ShareButton';