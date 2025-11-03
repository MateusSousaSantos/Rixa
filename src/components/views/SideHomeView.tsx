import React from "react";
import { useAuth, useMostFollowedUsers, useTrendingHashtags } from "../../hooks";
import { IoMdTrendingUp } from "react-icons/io";
import { CreatePost } from "../ui/CreatePost";
import { UserFollowButton } from "../features/UserFollowButton";
import type { NavigationView, UserProfileState } from "../../types/navigation";
import { useToast } from "../../contexts/ToastContext";

interface SideHomeViewProps {
  onUserClick?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const SideHomeView: React.FC<SideHomeViewProps> = ({ onUserClick }) => {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  
  // React Query hooks
  const { data: suggestedUsers = [], isLoading: isLoadingUsers } = useMostFollowedUsers(4);
  const { data: trendingTopics = [] } = useTrendingHashtags();

  const handleUserClick = (username: string) => {
    if (onUserClick) {
      const userDetails: UserProfileState = {
        username: username,
      };
      onUserClick("user-profile", userDetails);
    }
  };

  return (
    <>
      <div className="p-5 space-y-6 h-full overflow-y-auto scrollbar-thin scrollbar-track-rixa-dark scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {/* Create Post Button */}
        <CreatePost 
          onPostCreated={() => {
            // Optionally handle post creation
            showSuccess('Post criado com sucesso!');
          }}
          triggerText="Alguma rixa para tirar?"
        />

        {/* Trending Topics */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Trending no RIXA
          </h2>
          <div className="space-y-1">
            {(trendingTopics || []).map((topic, index) => (
              <div
                onClick={()=> {
                  showSuccess(`Clicou no tópico ${topic.tag}`);
                }}
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
        <div className="bg-rixa-dark rounded-lg px-4 py-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Quem seguir
          </h2>
          <div className="space-y-1">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rixa-blue"></div>
              </div>
            ) : suggestedUsers.length > 0 ? (
              suggestedUsers.map((suggestedUser) => (
                <div
                  key={suggestedUser.id}
                  className="w-full flex-row px-4 py-2 justify-between rounded-lg hover:bg-rixa-blue/10 transition-colors "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-rixa-blue/80 transition-colors"
                      onClick={() => handleUserClick(suggestedUser.username)}
                    >
                      {suggestedUser.nome?.charAt(0).toUpperCase() ||
                        suggestedUser.username?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                        onClick={() => handleUserClick(suggestedUser.username)}
                      >
                        {suggestedUser.nome || suggestedUser.username}
                      </h3>
                      <p className="text-sm text-rixa-cream/60">
                        @{suggestedUser.username}
                      </p>
                      <p className="text-xs text-rixa-cream/50">
                        {(suggestedUser.followerCount || 0) > 999
                          ? `${(
                              (suggestedUser.followerCount || 0) / 1000
                            ).toFixed(1)}K`
                          : suggestedUser.followerCount || 0}{" "}
                        seguidores
                      </p>
                    </div>
                  </div>
                  <UserFollowButton 
                    username={suggestedUser.username}
                    currentUser={user?.username}
                  />
                </div>
              ))
            ) : (
              <p className="text-rixa-cream/60 text-center p-4">
                Nenhum usuário encontrado
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
          <h2 className="text-lg font-bold text-rixa-cream mb-4">
            Ações Rápidas
          </h2>
          <div className="space-y-2">
            <button className="w-full flex p-3 text-left text-rixa-cream hover:bg-rixa-blue/10 rounded-lg transition-colors items-center gap-3">
              <IoMdTrendingUp size={24} />
              <span>Ver Trending</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};