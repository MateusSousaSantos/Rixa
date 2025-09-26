import React, { useState } from 'react'
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiBarChart } from 'react-icons/fi'

interface PoolPostProps {
  author: string
  content: string
  timestamp: string
  question: string
  options: Array<{
    id: number;
    text: string;
    votes: number;
  }>
  onCommentClick?: () => void
}

export const PoolPost: React.FC<PoolPostProps> = ({ 
  author, 
  content, 
  timestamp, 
  question, 
  options,
  onCommentClick
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = (optionId: number) => {
    if (!hasVoted) {
      setSelectedOption(optionId)
      setHasVoted(true)
    }
  }

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0
  }

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {author.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-rixa-cream">{author}</h3>
          <p className="text-sm text-rixa-cream/60">{timestamp}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-rixa-cream/60">
          <FiBarChart size={16} />
          <span className="text-sm">Enquete</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-rixa-cream/90 mb-3">{content}</p>

      {/* Poll Section */}
      <div className="bg-rixa-dark-shadow rounded-lg p-4 mb-4">
        <h4 className="text-rixa-cream font-semibold mb-4 text-center">{question}</h4>
        
        {/* Poll Options */}
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = getPercentage(option.votes)
            const isSelected = selectedOption === option.id
            
            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left relative overflow-hidden ${
                  hasVoted
                    ? isSelected
                      ? 'border-rixa-blue bg-rixa-blue/20 text-rixa-cream'
                      : 'border-rixa-blue/30 text-rixa-cream/80 cursor-not-allowed'
                    : 'border-rixa-blue/30 hover:border-rixa-blue text-rixa-cream hover:bg-rixa-blue/10'
                }`}
              >
                {/* Progress bar background for voted state */}
                {hasVoted && (
                  <div 
                    className="absolute inset-0 bg-rixa-blue/10 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex justify-between items-center">
                  <span className="font-medium">{option.text}</span>
                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{option.votes} votos</span>
                      <span className="text-sm font-bold">{percentage.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Vote count */}
        <div className="mt-4 text-center text-rixa-cream/60 text-sm">
          {hasVoted 
            ? `${totalVotes} pessoas votaram` 
            : `Clique em uma opção para votar • ${totalVotes} votos`
          }
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
          <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors">
            <FiShare2 size={16} />
            <span>Share</span>
          </button>
        </div>
        <button className="text-rixa-cream/40 hover:text-rixa-cream/60 transition-colors">
          <FiMoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}