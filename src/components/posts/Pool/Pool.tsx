import { useState } from "react";

interface PoolOption {
  options: Array<{
    id: number;
    text: string;
    votes: number;
  }>;
  onCommentClick?: () => void
  onUserClick?: (username: string) => void
}

export const Pool: React.FC<PoolOption> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = (optionId: number) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
      setHasVoted(true);
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };



  return (
    <div className="bg-rixa-dark-shadow rounded-lg p-4 mb-4">
      {/* Poll Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left relative overflow-hidden ${
                hasVoted
                  ? isSelected
                    ? "border-rixa-blue bg-rixa-blue/20 text-rixa-cream"
                    : "border-rixa-blue/30 text-rixa-cream/80 cursor-not-allowed"
                  : "border-rixa-blue/30 hover:border-rixa-blue text-rixa-cream hover:bg-rixa-blue/10"
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
                    <span className="text-sm font-bold">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-rixa-cream/60 text-sm">
        {hasVoted
          ? `${totalVotes} pessoas votaram`
          : `Clique em uma opção para votar • ${totalVotes} votos`}
      </div>
    </div>
  );
};
