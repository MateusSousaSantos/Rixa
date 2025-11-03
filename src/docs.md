## Rixa Data Structures

This document outlines the primary data structures used in the Rixa application.

### User-Related Structures

Found in `src/types/user.ts`.

- **`User`**: Represents a user's profile information.
  - `id: string`
  - `username: string`
  - `email: string`
  - `displayName: string`
  - `avatar?: string`
  - `bio?: string`
  - `createdAt: string`

- **`AuthState`**: Manages the user's authentication state.
  - `user: User | null`
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
  - `error: string | null`

### Post-Related Structures

- **`PostProps`** (from `src/components/posts/NormalPost.tsx`): Represents a standard post.
  - `author: string`
  - `content: string`
  - `timestamp: string`
  - `onCommentClick?: () => void`
  - `onUserClick?: (username: string) => void`

- **`DebatePostProps`** (from `src/components/posts/DebatePost.tsx`): Extends `PostProps` for debate-style posts.
  - `topic: string`
  - `sides: { pro: { votes: number; arguments: string[]; name?: string }; con: { votes: number; arguments: string[]; name?: string } }`

- **`PoolPostProps`** (from `src/components/posts/PoolPost.tsx`): Represents a post with a poll.
  - `author: string`
  - `content: string`
  - `timestamp: string`
  - `question: string`
  - `options: Array<{ id: number; text: string; votes: number; }>`
  - `onCommentClick?: () => void`
  - `onUserClick?: (username: string) => void`

The application defines three main types of posts, managed in `MobilePost.tsx`:
- `"normal"`
- `"debate"`
- `"poll"`

### Navigation-Related Structures

Found in `src/types/navigation.ts`.

- **`NavigationView`**: Defines the possible views in the application.
  - `"home" | "profile" | "postDetails" | "settings" | "userProfile"`

- **`UserProfileState`**: Holds the state for the user profile view.
  - `username: string`
