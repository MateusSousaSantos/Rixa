import React, { useState } from 'react'
import { useProfile } from '../hooks'
import { FiEdit2, FiSave, FiX } from 'react-icons/fi'

export const UserProfile: React.FC = () => {
  const { user, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
  })

  const handleSave = async () => {
    await updateProfile(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-rixa-cream">Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-2 text-rixa-blue hover:bg-rixa-blue/10 rounded-md transition-colors"
          >
            <FiEdit2 size={16} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-rixa-blue text-white rounded-md hover:bg-rixa-blue/90 transition-colors"
            >
              <FiSave size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 text-rixa-dark/60 hover:text-rixa-dark rounded-md transition-colors"
            >
              <FiX size={16} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-rixa-cream mb-1">
            Display Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.displayName}
              onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
              className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream"
            />
          ) : (
            <p className="text-rixa-cream">{user.displayName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-rixa-dark mb-1">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-rixa-dark/70">{user.bio || 'No bio yet.'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-rixa-dark mb-1">
            Email
          </label>
          <p className="text-rixa-dark/70">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-rixa-dark mb-1">
            Username
          </label>
          <p className="text-rixa-dark/70">@{user.username}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-rixa-dark mb-1">
            Joined
          </label>
          <p className="text-rixa-dark/70">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}