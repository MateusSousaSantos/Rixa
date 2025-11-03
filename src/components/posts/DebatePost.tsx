import React, { useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
  FiUsers,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { PostProps } from "./NormalPost";
import { useLikePost, useVoteInDebate } from "../../hooks";
import { formatTimestamp, isISOTimestamp } from "../../utils/dateUtils";

interface DebatePostProps extends PostProps {
  topic: string;
  sides: {
    pro: { votes: number; arguments: string[]; name?: string };
    con: { votes: number; arguments: string[]; name?: string };
  };
}

export const DebatePost: React.FC<DebatePostProps> = ({
  id,
  author,
  content,
  timestamp,
  topic,
  sides,
  likes = 0,
  isLiked = false,
  commentCount = 0,
  onCommentClick,
  onUserClick,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localSides, setLocalSides] = useState(sides);
  
  const likePostMutation = useLikePost();
  const voteInDebateMutation = useVoteInDebate();

  // Format timestamp for display
  const displayTimestamp = isISOTimestamp(timestamp) ? formatTimestamp(timestamp) : timestamp;

  const totalVotes = localSides.pro.votes + localSides.con.votes;
  const proPercentage = totalVotes > 0 ? (localSides.pro.votes / totalVotes) * 100 : 0;
  const conPercentage = totalVotes > 0 ? (localSides.con.votes / totalVotes) * 100 : 0;

  const proText = localSides.pro.name ? localSides.pro.name : "A favor";
  const conText = localSides.con.name ? localSides.con.name : "Contra";

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUserClick) {
      onUserClick(author)
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

  const handleVote = async (side: 'pro' | 'con') => {
    if (!id) return

    // Optimistic update
    setLocalSides(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        votes: prev[side].votes + 1
      }
    }))

    try {
      await voteInDebateMutation.mutateAsync({ postId: id, side })
    } catch (error) {
      // Revert optimistic update on error
      setLocalSides(sides)
      console.error('Error voting in debate:', error)
    }
  }

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-rixa-blue/80 transition-colors"
          onClick={handleUserClick}
        >
          {author.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 
            className="font-semibold text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
            onClick={handleUserClick}
          >
            {author}
          </h3>
          <p className="text-sm text-rixa-cream/60">{displayTimestamp}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-rixa-cream/60">
          <FiUsers size={16} />
          <span className="text-sm">Debate</span>
        </div>
      </div>

      <h4 className="text-rixa-cream font-semibold mb-4">{topic}</h4>
      {/* Content */}
      <p className="text-rixa-cream/90 mb-3">{content}</p>

      {/* Debate Topic */}
      <div className="bg-rixa-dark-shadow mb-4 h-64 flex flex-col justify-between rounded-lg overflow-hidden">
        {/* Progress Bar */}
        <div
          className="w-full bg-rixa-blue/20 h-12 flex overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="bg-blue-500 h-full transition-all duration-300 flex justify-center items-center relative py-2 cursor-pointer hover:bg-blue-600"
            style={{
              width: isHovering ? "50%" : `${proPercentage}%`,
            }}
            onClick={() => handleVote('pro')}
          >
            <span
              className={`text-lg text-rixa-cream font-bold whitespace-nowrap absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                proPercentage > 20 || isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {proText} ({localSides.pro.votes})
            </span>
          </div>
          <div
            className="bg-red-600 h-full transition-all duration-300 flex justify-center items-center relative cursor-pointer hover:bg-red-700"
            style={{
              width: isHovering ? "50%" : `${conPercentage}%`,
            }}
            onClick={() => handleVote('con')}
          >
            <span
              className={`text-lg text-rixa-cream font-bold whitespace-nowrap absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                conPercentage > 20 || isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {conText} ({localSides.con.votes})
            </span>
          </div>
        </div>

        {/* Arguments Preview */}
        <div className="h-full w-full flex justify-between"></div>
        <div className="width-full flex justify-center items-center p-2 bg-rixa-blue/20">
          <button className="font-bold text-rixa-cream">Participar</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-rixa-blue/20">
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
  );
};