import React, { useState } from "react";
import { useFollowUser, useUnfollowUser, useIsFollowingUser } from "../../hooks";
import { useToast } from "../../contexts/ToastContext";

interface UserFollowButtonProps {
  username: string;
  currentUser: string | undefined;
}

export const UserFollowButton: React.FC<UserFollowButtonProps> = ({ 
  username, 
  currentUser 
}) => {
  const { data: isFollowing = false, isLoading: isCheckingFollow } = useIsFollowingUser(username, !!currentUser);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();
  const { showSuccess, showError } = useToast();
  
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoadingAction(true);
    try {
      if (isFollowing) {
        await unfollowUserMutation.mutateAsync(username);
        showSuccess("Usuário deixado de seguir com sucesso!");
      } else {
        await followUserMutation.mutateAsync(username);
        showSuccess("Usuário seguido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao alterar status de seguir:", error);
      showError("Erro ao alterar status de seguimento");
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (!currentUser || currentUser === username) {
    return null;
  }

  const isLoading = isLoadingAction || followUserMutation.isPending || unfollowUserMutation.isPending;

  return (
    <button
      className={`px-4 py-1 mb-1 mt-2 rounded-full text-sm font-semibold transition-colors ${
        isFollowing
          ? "bg-rixa-cream/20 text-rixa-cream border border-rixa-cream/40 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/40"
          : "bg-rixa-blue text-rixa-cream hover:bg-rixa-blue/80"
      } ${
        isLoading || isCheckingFollow
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      onClick={handleFollowToggle}
      disabled={isLoading || isCheckingFollow}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
          <span>...</span>
        </div>
      ) : isFollowing ? (
        "Deixar de Seguir"
      ) : (
        "Seguir"
      )}
    </button>
  );
};