import React, { useState } from "react";
import { useAuth } from "../../hooks";
import { FiX, FiEdit, FiImage, FiSmile } from "react-icons/fi";
import type { NavigationView, UserProfileState } from "../../types/navigation";

interface MobilePost {
  onUserClick?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const MobilePost: React.FC<MobilePost> = ({}) => {
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"normal" | "debate">(
    "normal"
  );

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
    setPostContent("");
    setPostType("normal");
  };

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      // Aqui você implementaria a lógica para criar o post
      console.log("Creating post:", { content: postContent, type: postType });
      closeCreatePostModal();
    }
  };

  const CreatePostModal = () => {
    if (!isCreatePostModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeCreatePostModal}
        />

        {/* Modal Content */}
        <div className="relative bg-rixa-dark rounded-lg border border-rixa-blue/20 p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-rixa-cream">Criar Post</h2>
            <button
              onClick={closeCreatePostModal}
              className="p-2 text-rixa-cream/60 hover:text-rixa-cream hover:bg-rixa-blue/10 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold">
              {user?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-rixa-cream">
                {user?.nome || "Usuário"}
              </p>
              <p className="text-sm text-rixa-cream/60">
                @{user?.username || "usuario"}
              </p>
            </div>
          </div>

          {/* Post Type Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPostType("normal")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                postType === "normal"
                  ? "bg-rixa-blue text-rixa-cream"
                  : "bg-rixa-blue/20 text-rixa-blue hover:bg-rixa-blue/30"
              }`}
            >
              Post Normal
            </button>
            <button
              onClick={() => setPostType("debate")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                postType === "debate"
                  ? "bg-rixa-blue text-rixa-cream"
                  : "bg-rixa-blue/20 text-rixa-blue hover:bg-rixa-blue/30"
              }`}
            >
              Debate
            </button>
          </div>

          {/* Text Area */}
          <div className="mb-6">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={
                postType === "normal"
                  ? "O que você está pensando?"
                  : postType === "debate"
                  ? "Sobre o que você gostaria de debater?"
                  : "Qual pergunta você gostaria de fazer?"
              }
              className="w-full h-32 p-4 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 resize-none focus:outline-none focus:border-rixa-blue/50"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-rixa-cream/60">
                {postContent.length}/280
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-rixa-blue hover:bg-rixa-blue/10 rounded-full transition-colors">
                  <FiImage size={18} />
                </button>
                <button className="p-2 text-rixa-blue hover:bg-rixa-blue/10 rounded-full transition-colors">
                  <FiSmile size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Options for Different Post Types */}
          {postType === "debate" && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Posição A favor"
                  className="p-3 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue/50"
                />
                <input
                  type="text"
                  placeholder="Posição Contra"
                  className="p-3 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue/50"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeCreatePostModal}
              className="px-6 py-2 text-rixa-cream/70 hover:text-rixa-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePostSubmit}
              disabled={!postContent.trim()}
              className="px-6 py-2 bg-rixa-blue text-rixa-cream rounded-lg font-semibold hover:bg-rixa-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={openCreatePostModal}
        className="fixed bottom-6 right-6 bg-rixa-blue text-white p-4 rounded-full shadow-lg hover:bg-rixa-blue/90 focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:ring-offset-2 transition-colors z-40"
      >
        <FiEdit size={24} />
      </button>

      <CreatePostModal />
    </>
  );
};
