import { useState, useEffect } from 'react'
import { makeHealthCheck } from '../services/api'

export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const healthy = await makeHealthCheck()
        if (isMounted) {
          setIsHealthy(healthy)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Health check error:', error)
        if (isMounted) {
          setIsHealthy(false)
          setIsLoading(false)
        }
      }
    }

    checkHealth()

    // Retry health check every 30 seconds if unhealthy
    const interval = setInterval(() => {
      if (!isHealthy) {
        checkHealth()
      }
    }, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [isHealthy])

  const retryHealthCheck = async () => {
    setIsLoading(true)
    const healthy = await makeHealthCheck()
    setIsHealthy(healthy)
    setIsLoading(false)
  }

  return { isHealthy, isLoading, retryHealthCheck }
}