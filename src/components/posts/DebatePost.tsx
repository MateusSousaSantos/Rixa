import React, { useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiUsers,
} from "react-icons/fi";
import type { PostProps } from "./NormalPost";
import { ShareButton } from './ShareButton';

interface DebatePostProps extends PostProps {
  topic: string;
  sides: {
    pro: { votes: number; arguments: string[]; name?: string };
    con: { votes: number; arguments: string[]; name?: string };
  };
}

export const DebatePost: React.FC<DebatePostProps> = ({
  postId,
  author,
  content,
  timestamp,
  topic,
  sides,
  onCommentClick,
  onUserClick,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const totalVotes = sides.pro.votes + sides.con.votes;
  const proPercentage =
    totalVotes > 0 ? (sides.pro.votes / totalVotes) * 100 : 0;
  const conPercentage =
    totalVotes > 0 ? (sides.con.votes / totalVotes) * 100 : 0;

  const proText = sides.pro.name ? sides.pro.name : "A favor";
  const conText = sides.con.name ? sides.con.name : "Contra";

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUserClick) {
      onUserClick(author)
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
          <p className="text-sm text-rixa-cream/60">{timestamp}</p>
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
            className="bg-blue-500 h-full transition-all duration-300 flex justify-center items-center relative py-2"
            style={{
              width: isHovering ? "50%" : `${proPercentage}%`,
            }}
          >
            <span
              className={`text-lg text-rixa-cream font-bold whitespace-nowrap absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                proPercentage > 20 || isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {proText}
            </span>
          </div>
          <div
            className="bg-red-600 h-full transition-all duration-300 flex justify-center items-center relative"
            style={{
              width: isHovering ? "50%" : `${conPercentage}%`,
            }}
          >
            <span
              className={`text-lg text-rixa-cream font-bold whitespace-nowrap absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                conPercentage > 20 || isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {conText}
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
          <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
            <FiHeart size={16} />
            <span>Like</span>
          </button>
          <button 
            className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors"
            onClick={onCommentClick}
          >
            <FiMessageCircle size={16} />
            <span>Comment</span>
          </button>
          <ShareButton 
            options={{
              postId,
              author,
              content,
              postType: 'debate'
            }}
          />
        </div>
        <button className="text-rixa-cream/40 hover:text-rixa-cream/60 transition-colors">
          <FiMoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};