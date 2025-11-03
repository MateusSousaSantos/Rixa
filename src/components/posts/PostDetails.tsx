import React, { useState } from "react";
import { Comment } from "./Comment";
import { FiArrowLeft } from "react-icons/fi";
import type { NavigationView, PostDetailsState } from "../../types/navigation";
import { useAuth, useComments, useCreateComment, usePost } from "../../hooks";
import { formatTimestamp, isISOTimestamp } from "../../utils/dateUtils";

type CommentSectionState = "loading" | "error" | "empty" | "loaded";

interface PostDetailsProps {
  postId: number;
  // Legacy props for backward compatibility - will be overridden by fetched data
  author?: string;
  content?: string;
  timestamp?: string;
  postType?: "normal" | "debate";
  onBack?: () => void;
  onCommentClick?: (
    view: NavigationView,
    postDetails?: PostDetailsState
  ) => void;
}

export const PostDetails: React.FC<PostDetailsProps> = ({
  postId,
  // Legacy props for backward compatibility
  author: legacyAuthor = "Unknown User",
  content: legacyContent = "No content available",
  timestamp: legacyTimestamp = "Unknown time",
  postType: legacyPostType = "normal",
  onBack,
  onCommentClick,
}) => {
  const [newComment, setNewComment] = useState("");
  const { isAuthenticated } = useAuth();

  // Fetch the actual post data
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = usePost(postId);

  // Use fetched data or fallback to legacy props
  const author = post?.nomeAutor || legacyAuthor;
  const content = post?.conteudo || legacyContent;
  const timestamp = post?.data_criacao || legacyTimestamp;
  const postType = post?.tipo_post || legacyPostType;

  // Format timestamp for display
  const displayTimestamp = isISOTimestamp(timestamp) ? formatTimestamp(timestamp) : timestamp;

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
    if (comments?.length === 0) return "empty";
    return "loaded";
  };

  // Handle loading and error states for post data
  if (postLoading) {
    return (
      <div className="h-full flex flex-col p-4 overflow-hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4 flex-shrink-0"
          >
            <FiArrowLeft size={16} />
            <span>Voltar ao Início</span>
          </button>
        )}
        <div className="bg-rixa-dark rounded-lg border border-rixa-blue/20 flex-1 flex items-center justify-center">
          <div className="text-center text-rixa-cream/60">
            Carregando post...
          </div>
        </div>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="h-full flex flex-col p-4 overflow-hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4 flex-shrink-0"
          >
            <FiArrowLeft size={16} />
            <span>Voltar ao Início</span>
          </button>
        )}
        <div className="bg-rixa-dark rounded-lg border border-rixa-blue/20 flex-1 flex items-center justify-center">
          <div className="text-center text-rixa-red">
            Erro ao carregar post: {postError?.message || "Post não encontrado"}
          </div>
        </div>
      </div>
    );
  }

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
            {comments?.map((comment) => (
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
              {displayTimestamp || "Unknown time"}
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

                {/* Debate-specific content */}
                {postType === "debate" && post?.tipo_post === "debate" && (
                  <div className="bg-rixa-dark/30 p-4 rounded-lg border border-rixa-blue/10">
                    <h4 className="text-rixa-blue font-semibold mb-3">
                      Debate: {post.topic}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                        <h5 className="text-green-400 font-medium mb-2">
                          {post.sides.pro.name || "A favor"}
                        </h5>
                        <p className="text-sm text-rixa-cream/70">
                          {post.sides.pro.votes} votos
                        </p>
                        {post.sides.pro.arguments.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {post.sides.pro.arguments.slice(0, 3).map((arg, index) => (
                              <li key={index} className="text-xs text-rixa-cream/60">
                                • {arg}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                        <h5 className="text-red-400 font-medium mb-2">
                          {post.sides.con.name || "Contra"}
                        </h5>
                        <p className="text-sm text-rixa-cream/70">
                          {post.sides.con.votes} votos
                        </p>
                        {post.sides.con.arguments.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {post.sides.con.arguments.slice(0, 3).map((arg, index) => (
                              <li key={index} className="text-xs text-rixa-cream/60">
                                • {arg}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Stats */}
                {post && (
                  <div className="flex items-center gap-4 text-sm text-rixa-cream/60">
                    {post.likesCount !== undefined && (
                      <span className={`flex items-center gap-1 ${post.isLiked ? 'text-rixa-blue' : ''}`}>
                        {post.likesCount} curtidas
                      </span>
                    )}
                    {post.commentCount !== undefined && (
                      <span className="flex items-center gap-1">
                        {post.commentCount} comentários
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rixa-cream border-b border-rixa-blue/20 pb-2">
                  Comentários ({post?.commentCount || comments?.length || 0})
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