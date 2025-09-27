import React from "react";
import { useAuth, useRecommendedUsers } from "../../hooks";
import type { NavigationView, UserProfileState } from "../../types/navigation";

interface SideProfileViewProps {
  onUserClick?: (view: NavigationView, userDetails: UserProfileState) => void;
}

export const SideProfileView: React.FC<SideProfileViewProps> = ({ onUserClick }) => {
  const { user } = useAuth();
  const { data: recommendedUsers, isLoading, error } = useRecommendedUsers(4);

  

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Profile Access Required
          </h2>
          <p className="text-rixa-cream/70">
            Please log in to view and edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">
          Seu perfil
        </h1>
        <p className="text-rixa-cream/70">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      {/* Recommended Users Section */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h2 className="text-xl font-semibold text-rixa-cream mb-4">
          Usuários Recomendados
        </h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rixa-blue/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-rixa-blue/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-rixa-blue/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-rixa-cream/50 text-sm">
            Erro ao carregar usuários recomendados
          </p>
        ) : recommendedUsers && recommendedUsers.length > 0 ? (
          <div className="space-y-4">
            {recommendedUsers.map((recommendedUser) => (
              <div key={recommendedUser.id} className="flex items-center justify-between">
                <button
                  onClick={() => onUserClick?.('user-profile', { username: recommendedUser.username, userId: recommendedUser.id })}
                  className={`flex items-center space-x-3 flex-1 text-left rounded-lg p-2 -m-2 transition-colors ${
                    onUserClick ? 'hover:bg-rixa-blue/10 cursor-pointer' : 'cursor-default'
                  }`}
                  disabled={!onUserClick}
                  title={onUserClick ? `Ver perfil de ${recommendedUser.displayName}` : undefined}
                >
                  <div className="w-10 h-10 bg-rixa-blue/20 rounded-full flex items-center justify-center">
                    {recommendedUser.avatar ? (
                      <img
                        src={recommendedUser.avatar}
                        alt={recommendedUser.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-rixa-cream font-semibold text-sm">
                        {recommendedUser.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm truncate transition-colors ${
                      onUserClick 
                        ? 'text-rixa-cream hover:text-rixa-blue' 
                        : 'text-rixa-cream'
                    }`}>
                      {recommendedUser.displayName}
                    </h3>
                    <p className="text-rixa-cream/60 text-xs truncate">
                      @{recommendedUser.username}
                    </p>
                    {recommendedUser.bio && (
                      <p className="text-rixa-cream/50 text-xs mt-1 line-clamp-1">
                        {recommendedUser.bio}
                      </p>
                    )}
                  </div>
                </button>
                <button className="px-3 py-1 bg-rixa-blue hover:bg-rixa-blue/80 text-rixa-cream text-xs font-medium rounded-md transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-rixa-cream/50 text-sm">
            Nenhum usuário recomendado disponível
          </p>
        )}
      </div>
    </div>
  );
};
