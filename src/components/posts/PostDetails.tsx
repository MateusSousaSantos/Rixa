import React, { useState } from "react";
import { Comment } from "./Comment";
import { FiArrowLeft } from "react-icons/fi";
import type { NavigationView, PostDetailsState } from "../../types/navigation";
import { useAuth, useComments, useCreateComment } from "../../hooks";
import { Pool } from "./Pool/Pool";

type CommentSectionState = "loading" | "error" | "empty" | "loaded";

interface PostDetailsProps {
  author?: string;
  content?: string;
  timestamp?: string;
  postId?: number;
  postType?: "normal" | "debate" | "pool";
  onBack?: () => void;
  onCommentClick?: (
    view: NavigationView,
    postDetails?: PostDetailsState
  ) => void;
}

export const PostDetails: React.FC<PostDetailsProps> = ({
  author = "Unknown User",
  content = "No content available",
  timestamp = "Unknown time",
  postId = 0,
  postType = "normal",
  onBack,
  onCommentClick,
}) => {
  const [newComment, setNewComment] = useState("");
  const { isAuthenticated } = useAuth();

  // Use React Query for comments
  const {
    data: comments = [],
    isLoading: loading,
    error,
  } = useComments(postId);

  // Use React Query for creating comments
  const createCommentMutation = useCreateComment();

  const handleAddComment = async () => {
    if (!newComment.trim() || newComment.length > 500) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: newComment.trim(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      // Error is handled by the mutation's isError state
    }
  };

  // Determine comment section state
  const getCommentState = (): CommentSectionState => {
    if (loading) return "loading";
    if (error) return "error";
    if (comments.length === 0) return "empty";
    return "loaded";
  };

  const renderCommentSection = () => {
    switch (getCommentState()) {
      case "loading":
        return (
          <div className="text-center py-4 text-rixa-cream/60">
            Carregando comentários...
          </div>
        );

      case "error":
        return (
          <div className="text-center py-4 text-rixa-red">
            {error?.message || "Erro ao carregar comentários"}
          </div>
        );

      case "empty":
        return (
          <div className="text-center py-4 text-rixa-cream/60">
            <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
          </div>
        );

      case "loaded":
        return (
          <div className="space-y-3">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onCommentClick={(view, postDetails) => {
                  if (onCommentClick) {
                    onCommentClick(view, postDetails);
                  }
                }}
                showAsReply={false}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCommentForm = () => {
    // Only show comment form when not in loading or error state
    const state = getCommentState();
    if (state === "loading" || state === "error") {
      return null;
    }

    return (
      <div className="space-y-3 bg-rixa-dark/50 p-4 rounded-lg border border-rixa-blue/10">
        <textarea
          className="w-full p-3 rounded-lg bg-rixa-dark border border-rixa-blue/20 text-rixa-cream focus:outline-none focus:ring-2 focus:ring-rixa-blue resize-none"
          rows={2}
          placeholder="Adicione um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={createCommentMutation.isPending}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-rixa-cream/60">
            {newComment.length}/500 caracteres
          </span>
          <button
            className="px-4 py-2 bg-rixa-blue text-white rounded-lg hover:bg-rixa-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleAddComment}
            disabled={
              !newComment.trim() ||
              createCommentMutation.isPending ||
              newComment.length > 500
            }
          >
            {createCommentMutation.isPending
              ? "Adicionando..."
              : "Adicionar Comentário"}
          </button>
        </div>
        {createCommentMutation.isError && (
          <div className="text-rixa-red text-sm">
            Erro ao adicionar comentário. Tente novamente.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4 flex-shrink-0"
        >
          <FiArrowLeft size={16} />
          <span>Voltar ao Início</span>
        </button>
      )}

      {/* Main Content Container */}
      <div className="bg-rixa-dark rounded-lg border border-rixa-blue/20 flex flex-col flex-1 overflow-hidden">
        {/* Post Header - Fixed */}
        <div className="flex items-center gap-3 p-6 pb-4 flex-shrink-0 border-b border-rixa-blue/20">
          <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {author ? author.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="font-semibold text-rixa-cream">
              {author || "Unknown User"}
            </h3>
            <p className="text-sm text-rixa-cream/60">
              {timestamp || "Unknown time"}
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-2 py-1 bg-rixa-blue/20 text-rixa-blue rounded text-xs">
              {postType}
            </span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-rixa-dark scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            <div className="p-6 space-y-6">
              {/* Post Content */}
              <div className="space-y-4">
                <p className="text-rixa-cream/90 text-lg">
                  {content || "No content available"}
                </p>

                {/* Pool Component */}
                {postType === "pool" && (
                  <div className="">
                    <Pool
                      options={[
                        { id: 1, text: "Opção 1", votes: 10 },
                        { id: 2, text: "Opção 2", votes: 5 },
                        { id: 3, text: "Opção 3", votes: 2 },
                      ]}
                    />
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rixa-cream border-b border-rixa-blue/20 pb-2">
                  Comentários ({comments.length})
                </h3>

                {/* Comments List */}
                <div className="space-y-3 ">
                  {renderCommentSection()}
                </div>
              </div>
            </div>
          </div>

          {/* Comment Form - Fixed at bottom */}
          {isAuthenticated && (
            <div className="flex-shrink-0 p-6 pt-4 border-t border-rixa-blue/20">
              {renderCommentForm()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};