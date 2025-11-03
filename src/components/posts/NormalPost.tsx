import React, { useState } from 'react'
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useLikePost } from '../../hooks'
import { formatTimestamp, isISOTimestamp } from '../../utils/dateUtils'

export interface PostProps {
  id?: number
  author: string
  username?: string
  content: string
  timestamp: string
  likes?: number
  isLiked?: boolean
  commentCount?: number
  onCommentClick?: () => void
  onUserClick?: (username: string) => void
}

export const Post: React.FC<PostProps> = ({ 
  id,
  author, 
  username,
  content, 
  timestamp, 
  likes = 0,
  isLiked = false,
  commentCount = 0,
  onCommentClick, 
  onUserClick 
}) => {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked)
  const [localLikes, setLocalLikes] = useState(likes)
  const likePostMutation = useLikePost()

  // Format timestamp for display
  const displayTimestamp = isISOTimestamp(timestamp) ? formatTimestamp(timestamp) : timestamp

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUserClick) {
      onUserClick(username || author)
    }
  }

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!id) return

    // Optimistic update
    setLocalIsLiked(!localIsLiked)
    setLocalLikes(prev => localIsLiked ? prev - 1 : prev + 1)

    try {
      await likePostMutation.mutateAsync(id)
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsLiked(localIsLiked)
      setLocalLikes(likes)
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-rixa-blue/80 transition-colors"
          onClick={handleUserClick}
        >
          {author ? author.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 
            className="font-semibold text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
            onClick={handleUserClick}
          >
            {author || 'Unknown User'}
          </h3>
          <p className="text-sm text-rixa-cream/60">{displayTimestamp || 'Unknown time'}</p>
        </div>
      </div>
      <p className="text-rixa-cream/90">{content || 'No content available'}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rixa-blue/20">
        <div className="flex gap-6">
          <button 
            className={`flex items-center gap-2 text-sm transition-colors ${
              localIsLiked 
                ? 'text-rixa-red' 
                : 'text-rixa-cream/60 hover:text-rixa-red'
            }`}
            onClick={handleLikeClick}
            disabled={likePostMutation.isPending}
          >
            {localIsLiked ? <FaHeart size={16} /> : <FiHeart size={16} />}
            {localLikes > 0 && <span>{localLikes}</span>}
          </button>
          <button 
            className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors"
            onClick={onCommentClick}
          >
            <FiMessageCircle size={16} />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
          <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors">
            <FiShare2 size={16} />
          </button>
        </div>
        <button className="text-rixa-cream/40 hover:text-rixa-cream/60 transition-colors">
          <FiMoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}