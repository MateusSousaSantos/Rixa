import React, { useEffect, useState } from 'react'
import { UserProfile } from './UserProfile'
import { FiArrowLeft } from 'react-icons/fi'
import type { UserProfileState } from '../../types/navigation'
import { getUserById } from '../../services/userService'
import type { User } from '../../types/user'

interface UserProfileViewProps {
  userDetails: UserProfileState
  onBack?: () => void
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ userDetails, onBack }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // In a real app, you'd fetch by username or userId
        // For now, we'll simulate finding a user by username
        const response = await getUserById('1') // Mock - in real app use userDetails.userId or search by username
        
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          setError('Usuário não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar perfil do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userDetails.username, userDetails.userId])

  if (loading) {
    return (
      <div className="p-5 space-y-4 h-full">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4"
          >
            <FiArrowLeft size={16} />
            <span>Voltar</span>
          </button>
        )}
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
          <div className="text-rixa-cream">Carregando perfil...</div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-5 space-y-4 h-full">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4"
          >
            <FiArrowLeft size={16} />
            <span>Voltar</span>
          </button>
        )}
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Perfil não encontrado
          </h2>
          <p className="text-rixa-cream/70">
            {error || 'Não foi possível encontrar este usuário.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-4 h-full">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rixa-blue hover:text-rixa-cream transition-colors mb-4"
        >
          <FiArrowLeft size={16} />
          <span>Voltar</span>
        </button>
      )}
      <UserProfile profileUser={user} />
    </div>
  )
}