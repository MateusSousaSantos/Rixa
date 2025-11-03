// Utility functions for formatting timestamps and dates
// Following industry standard for date handling

export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return timestamp; // Return original if it's already formatted text
    }
    
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours === 1) {
      return '1 hora atrás'
    } else if (diffInHours < 24) {
      return `${diffInHours} horas atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays === 1) {
        return '1 dia atrás'
      } else if (diffInDays < 7) {
        return `${diffInDays} dias atrás`
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7)
        return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`
      } else {
        return date.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
      }
    }
  } catch (error) {
    console.warn('Error formatting timestamp:', timestamp, error)
    return timestamp; // Return original if formatting fails
  }
}

export const formatDate = (timestamp: string): string => {
  try {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

export const getRelativeTime = (timestamp: string): string => {
  return formatTimestamp(timestamp)
}

// Check if a string is an ISO timestamp
export const isISOTimestamp = (timestamp: string): boolean => {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
  return iso8601Regex.test(timestamp)
}