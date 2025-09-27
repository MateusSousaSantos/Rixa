import { useMutation } from '@tanstack/react-query'
import { uploadImage, uploadVideo, uploadAvatar } from '../services'

// Hook for uploading images
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onError: (error) => {
      console.error('Error uploading image:', error)
    },
  })
}

// Hook for uploading videos
export const useUploadVideo = () => {
  return useMutation({
    mutationFn: (file: File) => uploadVideo(file),
    onError: (error) => {
      console.error('Error uploading video:', error)
    },
  })
}

// Hook for uploading avatar
export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onError: (error) => {
      console.error('Error uploading avatar:', error)
    },
  })
}