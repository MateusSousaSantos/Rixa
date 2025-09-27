export type NavigationView = 'home' | 'profile' | 'settings' | 'login' | 'signup' | 'post' | 'debate' | 'pool' | 'post-details' | 'user-profile';

export interface PostDetailsState {
  postId: number;
  postType: 'normal' | 'debate' | 'pool';
  author: string;
  content: string;
  timestamp: string;
}

export interface UserProfileState {
  username: string;
  userId?: string;
}