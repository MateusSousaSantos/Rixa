export type NavigationView = 'home' | 'profile' | 'settings' | 'login' | 'signup' | 'post' | 'debate' | 'pool' | 'post-details';

export interface PostDetailsState {
  postId: number;
  postType: 'normal' | 'debate' | 'pool';
  author: string;
  content: string;
  timestamp: string;
  // Add other post-specific data as needed
}