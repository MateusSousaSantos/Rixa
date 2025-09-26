import React from 'react';
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi';
import type { NavigationView, PostDetailsState } from '../../types/navigation';

export interface CommentData {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  parentId?: number;
  replyCount?: number;
}

interface CommentProps {
  comment: CommentData;
  onCommentClick?: (view: NavigationView, postDetails?: PostDetailsState) => void;
  showAsReply?: boolean;
}

export const Comment: React.FC<CommentProps> = ({ 
  comment, 
  onCommentClick,
  showAsReply = false
}) => {
  const handleCommentClick = () => {
    if (onCommentClick && comment) {
      const postDetails: PostDetailsState = {
        postId: comment.id || Date.now(),
        postType: 'normal', // Comments are treated as normal posts
        author: comment.author || 'Unknown User',
        content: comment.content || 'No content available',
        timestamp: comment.timestamp || 'Unknown time',
      };
      onCommentClick('post-details', postDetails);
    }
  };

  return (
    <div 
      className={`bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-4 mb-4 cursor-pointer hover:border-rixa-blue/40 transition-colors ${
        showAsReply ? 'ml-8 border-l-4 border-l-rixa-blue/60' : ''
      }`}
      onClick={handleCommentClick}
    >
      {/* Comment Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-semibold text-rixa-cream">{comment.author || 'Unknown User'}</h3>
          <p className="text-sm text-rixa-cream/60">{comment.timestamp || 'Unknown time'}</p>
        </div>
        {showAsReply && (
          <div className="ml-auto">
            <span className="px-2 py-1 bg-rixa-blue/20 text-rixa-blue rounded text-xs">
              Reply
            </span>
          </div>
        )}
      </div>

      {/* Comment Content */}
      <p className="text-rixa-cream/90 mb-3">{comment.content || 'No content available'}</p>

      {/* Comment Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-rixa-blue/20">
        <div className="flex gap-6">
          <button 
            className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle like action
            }}
          >
            <FiHeart size={16} />
          </button>
          <button 
            className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleCommentClick();
            }}
          >
            <FiMessageCircle size={16} />
            {(comment.replyCount || 0) > 0 && (
              <span>{comment.replyCount}</span>
            )}
          </button>
        </div>
        <button 
          className="text-rixa-cream/40 hover:text-rixa-cream/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options
          }}
        >
          <FiMoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};