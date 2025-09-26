// Mock data service to simulate comment replies
import type { CommentData } from "../components/posts/Comment";

// Mock database of comments and their replies
const mockCommentDatabase: Record<number, CommentData[]> = {
  1: [
    {
      id: 101,
      content: "I completely agree with your first comment!",
      author: "ReplyUser1",
      timestamp: "2023-10-01 11:00",
      parentId: 1,
      replyCount: 2
    },
    {
      id: 102,
      content: "Thanks for the detailed explanation in your comment.",
      author: "ReplyUser2",
      timestamp: "2023-10-01 11:30",
      parentId: 1,
      replyCount: 0
    }
  ],
  2: [
    {
      id: 201,
      content: "I have a different perspective on this.",
      author: "ReplyUser3",
      timestamp: "2023-10-01 12:00",
      parentId: 2,
      replyCount: 1
    }
  ],
  3: [
    {
      id: 301,
      content: "You're welcome! Glad it was helpful.",
      author: "ReplyUser4",
      timestamp: "2023-10-01 12:30",
      parentId: 3,
      replyCount: 0
    },
    {
      id: 302,
      content: "This really opened my mind to new ideas.",
      author: "ReplyUser5",
      timestamp: "2023-10-01 13:00",
      parentId: 3,
      replyCount: 0
    }
  ],
  101: [
    {
      id: 1001,
      content: "Yes, exactly! This is a great discussion thread.",
      author: "DeepUser1",
      timestamp: "2023-10-01 11:15",
      parentId: 101,
      replyCount: 0
    },
    {
      id: 1002,
      content: "I'm learning so much from this conversation.",
      author: "DeepUser2",
      timestamp: "2023-10-01 11:45",
      parentId: 101,
      replyCount: 0
    }
  ],
  201: [
    {
      id: 2001,
      content: "Can you elaborate on your perspective?",
      author: "CuriousUser",
      timestamp: "2023-10-01 12:15",
      parentId: 201,
      replyCount: 0
    }
  ]
};

export const getCommentReplies = (commentId: number): CommentData[] => {
  return mockCommentDatabase[commentId] || [];
};

export const addCommentReply = (parentId: number, reply: CommentData): void => {
  if (!mockCommentDatabase[parentId]) {
    mockCommentDatabase[parentId] = [];
  }
  mockCommentDatabase[parentId].push(reply);
};

// Helper to get the original comment data when viewing its replies
export const getOriginalComment = (commentId: number): CommentData | null => {
  // Search through all comments to find the original
  for (const comments of Object.values(mockCommentDatabase)) {
    const found = comments.find(comment => comment.id === commentId);
    if (found) return found;
  }
  
  // If not found in replies, it might be a top-level comment
  const topLevelComments: CommentData[] = [
    {
      id: 1,
      content: "This is the first comment",
      author: "User1",
      timestamp: "2023-10-01 10:00",
      replyCount: 2
    },
    {
      id: 2,
      content: "Great discussion! I agree with the main points.",
      author: "User2",
      timestamp: "2023-10-01 11:30",
      replyCount: 1
    },
    {
      id: 3,
      content: "Thanks for sharing this perspective.",
      author: "User3",
      timestamp: "2023-10-01 12:15",
      replyCount: 2
    },
  ];
  
  return topLevelComments.find(comment => comment.id === commentId) || null;
};