export type NavigationView = 'home' | 'profile' | 'settings' | 'login' | 'signup' | 'post' | 'debate' | 'post-details' | 'user-profile';

export interface PostDetailsState {
  postId: number;
  postType: 'normal' | 'debate';
  author: string;
  content: string;
  timestamp: string;
}

export interface UserProfileState {
  username: string;
  userId?: string;
}