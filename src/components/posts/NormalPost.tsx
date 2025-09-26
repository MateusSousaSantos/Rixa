import React from 'react'
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } from 'react-icons/fi'

export interface PostProps {
  author: string
  content: string
  timestamp: string
  onCommentClick?: () => void
}

export const Post: React.FC<PostProps> = ({ author, content, timestamp, onCommentClick }) => {
  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {author ? author.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-semibold text-rixa-cream">{author || 'Unknown User'}</h3>
          <p className="text-sm text-rixa-cream/60">{timestamp || 'Unknown time'}</p>
        </div>
      </div>
      <p className="text-rixa-cream/90">{content || 'No content available'}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rixa-blue/20">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
            <FiHeart size={16} />
          </button>
          <button 
            className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors"
            onClick={onCommentClick}
          >
            <FiMessageCircle size={16} />
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