import React, { useState, useEffect } from "react";
import { Comment, type CommentData } from "./posts/Comment";
import { FiArrowLeft } from "react-icons/fi";
import type { NavigationView, PostDetailsState } from "../types/navigation";
import { fetchComments, createComment } from "../services/commentService";

interface PostDetailsProps {
  author?: string;
  content?: string;
  timestamp?: string;
  postId?: number;
  postType?: 'normal' | 'debate' | 'pool';
  onBack?: () => void;
  onCommentClick?: (view: NavigationView, postDetails?: PostDetailsState) => void;
}

export const PostDetails: React.FC<PostDetailsProps> = ({
  author = 'Unknown User',
  content = 'No content available',
  timestamp = 'Unknown time',
  postId = 0,
  postType = 'normal',
  onBack,
  onCommentClick,
}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchComments(postId);
      if (response.success) {
        setComments(response.data);
      } else {
        setError('Falha ao carregar comentários');
      }
    } catch (err) {
      setError('Erro ao carregar comentários');
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await createComment(postId, newComment);
      if (response.success) {
        setComments([response.data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };



  return (
    <div className="space-y-6 p-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4"
        >
          <FiArrowLeft size={16} />
          <span>Voltar ao Início</span>
        </button>
      )}

      {/* Original Post or Comment */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {author ? author.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-rixa-cream">{author || 'Unknown User'}</h3>
            <p className="text-sm text-rixa-cream/60">{timestamp || 'Unknown time'}</p>
          </div>
          <div className="ml-auto">
            <span className="px-2 py-1 bg-rixa-blue/20 text-rixa-blue rounded text-xs">
              {postType}
            </span>
          </div>
        </div>
        <p className="text-rixa-cream/90 text-lg">{content || 'No content available'}</p>
      </div>

      {/* Add Comment Section */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h4 className="text-md font-semibold text-rixa-cream mb-3">
          Adicionar Comentário
        </h4>
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-3 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50 resize-none"
            rows={3}
            placeholder="Compartilhe seus pensamentos..."
          />
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-rixa-blue text-white rounded-lg hover:bg-rixa-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Postar
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4">
          Comentários ({comments.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-4 text-rixa-cream/60">
            Carregando comentários...
          </div>
        ) : error ? (
          <div className="text-center py-4 text-rixa-red">
            {error}
          </div>
        ) : (
          <div className="space-y-0">
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
        )}
        
        {!loading && comments.length === 0 && (
          <div className="text-center py-8 text-rixa-cream/60">
            <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
          </div>
        )}
      </div>
    </div>
  );
};