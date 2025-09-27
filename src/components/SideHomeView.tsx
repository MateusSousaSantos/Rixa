import React, { useState } from "react";
import { useAuth } from "../hooks";
import { IoMdTrendingUp } from "react-icons/io";
import { GoCommentDiscussion } from "react-icons/go";
import { FiX, FiEdit, FiImage, FiSmile } from "react-icons/fi";
import type {
  NavigationView,
  UserProfileState,
} from "../types/navigation";
import { MdOutlinePoll } from "react-icons/md";

interface SideHomeViewProps {
  onUserClick?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const SideHomeView: React.FC<SideHomeViewProps> = ({
  onUserClick,
}) => {
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"normal" | "debate" | "poll">("normal");

  const handleUserClick = (username: string) => {
    if (onUserClick) {
      const userDetails: UserProfileState = {
        username: username,
      };
      onUserClick("user-profile", userDetails);
    }
  };

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

  const trendingTopics = [
    { tag: "#TechNews", posts: 1234 },
    { tag: "#DebateNoite", posts: 892 },
    { tag: "#EnqueteDoDia", posts: 567 },
    { tag: "#Política2024", posts: 445 },
    { tag: "#Música", posts: 332 },
  ];

  const suggestedUsers = [
    {
      username: "techguru",
      displayName: "Tech Guru",
      followers: "12.3K",
      avatar: "/default-avatar.png",
    },
    {
      username: "debatequeen",
      displayName: "Debate Queen",
      followers: "8.7K",
      avatar: "/default-avatar.png",
    },
    {
      username: "pollmaster",
      displayName: "Poll Master",
      followers: "5.9K",
      avatar: "/default-avatar.png",
    },
    {
      username: "newsbreaker",
      displayName: "News Breaker",
      followers: "15.2K",
      avatar: "/default-avatar.png",
    },
  ];

  // Create Post Modal Component
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
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-rixa-cream">{user?.displayName || 'Usuário'}</p>
              <p className="text-sm text-rixa-cream/60">@{user?.username || 'usuario'}</p>
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
            <button
              onClick={() => setPostType("poll")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                postType === "poll"
                  ? "bg-rixa-blue text-rixa-cream"
                  : "bg-rixa-blue/20 text-rixa-blue hover:bg-rixa-blue/30"
              }`}
            >
              Enquete
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

          {postType === "poll" && (
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Opção 1"
                className="w-full p-3 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue/50"
              />
              <input
                type="text"
                placeholder="Opção 2"
                className="w-full p-3 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-lg text-rixa-cream placeholder-rixa-cream/50 focus:outline-none focus:border-rixa-blue/50"
              />
              <button className="text-rixa-blue hover:text-rixa-cream transition-colors text-sm">
                + Adicionar opção
              </button>
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
      <div className="p-5 space-y-6 h-full overflow-y-auto scrollbar-thin scrollbar-track-rixa-dark scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {/* Create Post Button */}
        {user && (
          <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
            <button
              onClick={openCreatePostModal}
              className="w-full flex items-center gap-3 p-4 text-left text-rixa-cream/70 bg-rixa-dark-shadow hover:bg-rixa-blue/10 rounded-lg transition-colors border border-rixa-blue/20"
            >
              <div className="w-10 h-10 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <span className="text-rixa-cream/60">Alguma rixa para tirar?</span>
              </div>
              <FiEdit size={20} className="text-rixa-blue" />
            </button>
          </div>
        )}

        {/* Trending Topics */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Trending no RIXA
          </h2>
          <div className="space-y-1">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-rixa-blue/10 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-rixa-blue">{topic.tag}</p>
                  <p className="text-sm text-rixa-cream/60">
                    {topic.posts.toLocaleString()} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">Quem seguir</h2>
          <div className="space-y-1">
            {suggestedUsers.map((suggestedUser, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-rixa-blue/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-rixa-blue/80 transition-colors"
                    onClick={() => handleUserClick(suggestedUser.username)}
                  >
                    {suggestedUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                      onClick={() => handleUserClick(suggestedUser.username)}
                    >
                      {suggestedUser.displayName}
                    </h3>
                    <p className="text-sm text-rixa-cream/60">
                      @{suggestedUser.username}
                    </p>
                    <p className="text-xs text-rixa-cream/50">
                      {suggestedUser.followers} seguidores
                    </p>
                  </div>
                </div>
                <button className="px-4 py-1 bg-rixa-blue text-rixa-cream rounded-full text-sm font-semibold hover:bg-rixa-blue/80 transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-rixa-cream/70">Posts hoje</span>
              <span className="font-bold text-rixa-blue">2.3K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-rixa-cream/70">Debates ativos</span>
              <span className="font-bold text-rixa-blue">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-rixa-cream/70">Enquetes abertas</span>
              <span className="font-bold text-rixa-blue">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-rixa-cream/70">Usuários online</span>
              <span className="font-bold text-green-500">12.8K</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Ações Rápidas
          </h2>
          <div className="space-y-2">
            <button 
              onClick={() => {
                setPostType("debate");
                openCreatePostModal();
              }}
              className="w-full flex p-3 text-left text-rixa-cream hover:bg-rixa-blue/10 rounded-lg transition-colors items-center gap-3"
            >
              <GoCommentDiscussion size={24}/> 
              <span>Criar Debate</span>
            </button>
            <button 
              onClick={() => {
                setPostType("poll");
                openCreatePostModal();
              }}
              className="w-full flex p-3 text-left text-rixa-cream hover:bg-rixa-blue/10 rounded-lg transition-colors items-center gap-3"
            >
              <MdOutlinePoll size={24}/> 
              <span>Criar Enquete</span>
            </button>
            <button className="w-full flex p-3 text-left text-rixa-cream hover:bg-rixa-blue/10 rounded-lg transition-colors items-center gap-3">
              <IoMdTrendingUp size={24} />
              <span>Ver Trending</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Modal */}
      <CreatePostModal />
    </>
  );
};