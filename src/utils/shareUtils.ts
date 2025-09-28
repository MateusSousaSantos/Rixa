/**
 * Utilities for sharing posts to external platforms
 */

export interface ShareOptions {
  postId: number
  author: string
  content: string
  postType: 'normal' | 'debate' | 'pool'
}

/**
 * Parses URL parameters to check for shared post
 */
export const parseSharedPostFromUrl = (): { postId: number } | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const postId = urlParams.get('post')
    
    if (postId && !isNaN(Number(postId))) {
      return { postId: Number(postId) }
    }
  } catch (error) {
    console.error('Error parsing URL parameters:', error)
  }
  
  return null
}

/**
 * Generates a shareable URL for a post
 */
export const generatePostUrl = (postId: number): string => {
  const baseUrl = window.location.origin
  return `${baseUrl}/?post=${postId}`
}

/**
 * Generates share text for social media
 */
export const generateShareText = (options: ShareOptions): string => {
  const { author, content, postType } = options
  
  let shareText = `Check out this ${postType} post by @${author}: `
  
  // Truncate content if too long
  const truncatedContent = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content
  
  shareText += `"${truncatedContent}"`
  
  return shareText
}

/**
 * Copies post URL to clipboard
 */
export const copyPostUrlToClipboard = async (postId: number): Promise<boolean> => {
  try {
    const url = generatePostUrl(postId)
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error)
    return false
  }
}

/**
 * Uses Web Share API if available, falls back to clipboard
 */
export const sharePost = async (options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> => {
  const { postId } = options
  const url = generatePostUrl(postId)
  const text = generateShareText(options)
  
  // Try Web Share API first (mobile browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Rixa Post',
        text: text,
        url: url,
      })
      return 'shared'
    } catch (error) {
      // User cancelled sharing or error occurred
      console.log('Web Share API cancelled or failed:', error)
    }
  }
  
  // Fallback to clipboard
  const copied = await copyPostUrlToClipboard(postId)
  return copied ? 'copied' : 'failed'
}

/**
 * Generate direct social media sharing URLs
 */
export const generateSocialShareUrls = (options: ShareOptions) => {
  const url = generatePostUrl(options.postId)
  const text = generateShareText(options)
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  }
}

/**
 * Open social media share dialog
 */
export const openSocialShare = (platform: keyof ReturnType<typeof generateSocialShareUrls>, options: ShareOptions): void => {
  const urls = generateSocialShareUrls(options)
  const shareUrl = urls[platform]
  
  // Open in new window/tab
  window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
}