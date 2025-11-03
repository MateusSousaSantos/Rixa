import React, { useState, useCallback } from 'react';
import { FiX, FiEdit } from "react-icons/fi";
import { useCreatePost } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks';

interface CreatePostProps {
  onPostCreated?: () => void;
  triggerText?: string;
  showAsButton?: boolean;
  showAsSimpleButton?: boolean;
  initialPostType?: 'normal' | 'debate';
}

// Extracted CreatePostModal component to prevent re-renders
const CreatePostModal = React.memo<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  content: string;
  setContent: (content: string) => void;
  postType: 'normal' | 'debate';
  setPostType: (type: 'normal' | 'debate') => void;
  debateTopic: string;
  setDebateTopic: (topic: string) => void;
  proSide: string;
  setProSide: (side: string) => void;
  conSide: string;
  setConSide: (side: string) => void;
  isLoading: boolean;
}>(({ 
  isOpen,
  onClose,
  onSubmit,
  content,
  setContent,
  postType,
  setPostType,
  debateTopic,
  setDebateTopic,
  proSide,
  setProSide,
  conSide,
  setConSide,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-rixa-dark rounded-lg border border-rixa-blue/20 p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-rixa-cream">Criar Post</h2>
          <button
            onClick={onClose}
            className="p-2 text-rixa-cream/60 hover:text-rixa-cream hover:bg-rixa-blue/10 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setPostType('normal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                postType === 'normal'
                  ? 'bg-rixa-blue text-rixa-dark'
                  : 'bg-rixa-gray text-rixa-cream hover:bg-rixa-blue/20'
              }`}
            >
              Post Normal
            </button>
            <button
              onClick={() => setPostType('debate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                postType === 'debate'
                  ? 'bg-rixa-blue text-rixa-dark'
                  : 'bg-rixa-gray text-rixa-cream hover:bg-rixa-blue/20'
              }`}
            >
              Debate
            </button>
          </div>
        </div>

        {/* Debate specific fields */}
        {postType === 'debate' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-rixa-cream mb-2">
                Tópico do Debate
              </label>
              <input
                type="text"
                value={debateTopic}
                onChange={(e) => setDebateTopic(e.target.value)}
                placeholder="Qual é o tema do debate?"
                className="w-full px-3 py-2 bg-rixa-gray border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rixa-cream mb-2">
                  Lado A (Prós)
                </label>
                <input
                  type="text"
                  value={proSide}
                  onChange={(e) => setProSide(e.target.value)}
                  placeholder="Ex: A favor"
                  className="w-full px-3 py-2 bg-rixa-gray border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rixa-cream mb-2">
                  Lado B (Contras)
                </label>
                <input
                  type="text"
                  value={conSide}
                  onChange={(e) => setConSide(e.target.value)}
                  placeholder="Ex: Contra"
                  className="w-full px-3 py-2 bg-rixa-gray border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-rixa-cream mb-2">
            Conteúdo do Post
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você está pensando?"
            rows={4}
            className="w-full px-3 bg-rixa-dark py-2 bg-rixa-gray border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 resize-none focus:outline-none focus:border-rixa-blue"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-rixa-cream/80 hover:text-rixa-cream hover:bg-rixa-gray/50 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !content.trim()}
            className="px-6 py-2 bg-gradient-to-r from-rixa-blue to-purple-600 text-white rounded-lg hover:from-rixa-blue/80 hover:to-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Postando...' : 'Postar'}
          </button>
        </div>
      </div>
    </div>
  );
});

CreatePostModal.displayName = 'CreatePostModal';

export const CreatePost: React.FC<CreatePostProps> = ({ 
  onPostCreated,
  triggerText = "Alguma rixa para tirar?",
  showAsButton = true,
  showAsSimpleButton = false,
  initialPostType = 'normal'
}) => {
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'normal' | 'debate'>(initialPostType || 'normal');
  
  // For debate posts
  const [debateTopic, setDebateTopic] = useState('');
  const [proSide, setProSide] = useState('');
  const [conSide, setConSide] = useState('');
  
  const createPostMutation = useCreatePost();
  const { showToast } = useToast();

  const openCreatePostModal = useCallback(() => {
    setPostType(initialPostType); // Reset to initial type when opening
    setIsCreatePostModalOpen(true);
  }, [initialPostType]);

  const closeCreatePostModal = useCallback(() => {
    setIsCreatePostModalOpen(false);
    setContent('');
    setPostType('normal');
    setDebateTopic('');
    setProSide('');
    setConSide('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      showToast('error', 'Por favor, insira o conteúdo do post');
      return;
    }

    if (postType === 'debate' && !debateTopic.trim()) {
      showToast('error', 'Por favor, insira o tópico do debate');
      return;
    }

    try {
      const postData = {
        content,
        type: postType,
        midia: null,
        post_pai_id: null,
        debate_id: null,
      };

      const result = await createPostMutation.mutateAsync(postData);
      
      if (result.success) {
        showToast('success', 'Post criado com sucesso!');
        closeCreatePostModal();
        
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        showToast('error', result.message || 'Erro ao criar post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('error', 'Erro ao criar post');
    }
  }, [content, postType, debateTopic, createPostMutation, showToast, onPostCreated, closeCreatePostModal]);

  if (!user) return null;

  return (
    <>
      {showAsButton ? (
          <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
            <button
              onClick={openCreatePostModal}
              className="w-full flex items-center gap-3 p-4 text-left text-rixa-cream/70 bg-rixa-dark-shadow hover:bg-rixa-blue/10 rounded-lg transition-colors border border-rixa-blue/20"
            >
              <div className="w-10 h-10 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold">
                {user.nome?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <span className="text-rixa-cream/60">
                  Alguma rixa para tirar?
                </span>
              </div>
              <FiEdit size={20} className="text-rixa-blue" />
            </button>
          </div>
      ) : showAsSimpleButton ? (
        <button
          onClick={openCreatePostModal}
          className="px-4 py-2 bg-rixa-blue text-white rounded-lg hover:bg-rixa-blue/80 transition-colors"
        >
          Novo Post
        </button>
      ) : (
        <div className="bg-rixa-dark border border-rixa-blue/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar || '/api/placeholder/40/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={openCreatePostModal}
              className="flex-1 p-3 text-left text-rixa-cream/60 bg-rixa-gray rounded-full hover:bg-rixa-gray/80 transition-colors"
            >
              {triggerText}
            </button>
          </div>
        </div>
      )}

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={closeCreatePostModal}
        onSubmit={handleSubmit}
        content={content}
        setContent={setContent}
        postType={postType}
        setPostType={setPostType}
        debateTopic={debateTopic}
        setDebateTopic={setDebateTopic}
        proSide={proSide}
        setProSide={setProSide}
        conSide={conSide}
        setConSide={setConSide}
        isLoading={createPostMutation.isPending}
      />
    </>
  );
};