import React, { useState } from "react";
import { FiCamera, FiEdit2, FiSave } from "react-icons/fi";
import type { User } from "../../types/user";

interface UserProfileProps {
  profileUser?: User; // The user whose profile is being viewed
  isOwnProfile: boolean; // Whether this is the current user's profile
  onUserUpdate: (updatedData: Partial<User>) => Promise<void>; // Function to handle profile updates
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  profileUser, 
  isOwnProfile, 
  onUserUpdate 
}) => {
  // Use profileUser - it should always be provided now
  const user = profileUser;

  // Only allow editing if viewing own profile
  const canEdit = isOwnProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome: user?.nome || "",
    bios: user?.bios || "",
  });

  const handleSave = async () => {
    if (canEdit && user) {
      try {
        await onUserUpdate({
          nome: editData.nome,
          bios: editData.bios,
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show error message to user - could be enhanced with toast notifications
      }
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canEdit) {
      console.log("Avatar file selected:", file);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6 h-full flex flex-col overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex">
          <div className="relative w-36 h-36">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-rixa-blue"
            />

            {isEditing && canEdit && (
              <>
                <button
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  className="absolute -top-2 -right-2 bg-rixa-blue rounded-full p-2 shadow-lg hover:bg-rixa-blue/80 transition-colors z-10"
                >
                  <FiCamera size={16} className="text-rixa-cream" />
                </button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="ml-4 flex flex-col justify-start space-y-4">
            {!isEditing || !canEdit ? (
              <h2 className="text-3xl font-bold text-rixa-cream">
                {user.nome || "Unnamed User"}
              </h2>
            ) : (
              <input
                type="text"
                value={editData.nome}
                onChange={(e) =>
                  setEditData({ ...editData, nome: e.target.value })
                }
                className="text-2xl font-bold text-rixa-cream bg-transparent border-b border-rixa-blue focus:outline-none"
              />
            )}
            <h2 className="text-xl text-rixa-blue">
              @{user.username || "Unnamed User"}
            </h2>
          </div>
        </div>

        {canEdit &&
          (!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                console.log("Edit mode enabled", user);
              }}
              className="group flex items-center gap-2 px-3 py-2 text-rixa-blue hover:bg-rixa-blue rounded-md transition-colors"
            >
              <FiEdit2
                size={16}
                className="group-hover:text-rixa-cream transition-colors"
              />
              <span className="group-hover:text-rixa-cream transition-colors">
                Edit
              </span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 text-rixa-blue hover:bg-rixa-blue/10 rounded-md transition-colors bg-rixa-blue"
            >
              <FiSave size={16} color="#FCF6F5FF" />
              <span className="text-rixa-cream">Save</span>
            </button>
          ))}
      </div>

      {/* Stats Section - Fixed */}
      <div className="flex gap-x-5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-rixa-cream mb-1">{user.followingCount || 0}</h3>
          <p className="text-rixa-cream/70">Seguindo</p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-rixa-cream mb-1">{user.followerCount || 0}</h3>
          <p className="text-rixa-cream/70">Seguidores</p>
        </div>
      </div>

      {/* Bio Section - Fixed Height */}
      <div className="h-32 flex-shrink-0 mb-4">
        {!isEditing || !canEdit ? (
          <p className="text-rixa-cream/70">
            {user.bios || "No bio available."}
          </p>
        ) : (
          <textarea
            value={editData.bios}
            onChange={(e) =>
              setEditData({ ...editData, bios: e.target.value })
            }
            className="w-full h-full p-2 border border-rixa-blue rounded-md bg-rixa-blue/20 text-rixa-cream focus:outline-none focus:ring-2 focus:ring-rixa-blue resize-none"
          />
        )}
      </div>

      {/* Rixas Section - Flexible with Scroll */}
      <div className="flex-1 border-t border-rixa-blue/20 pt-4 flex flex-col overflow-hidden">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4 flex-shrink-0">
          {canEdit ? "Minhas Rixas" : "Rixas"}
        </h3>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-rixa-dark scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-rixa-cream/70">
              {canEdit
                ? "Você ainda não tem rixas."
                : "Este usuário ainda não tem rixas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};