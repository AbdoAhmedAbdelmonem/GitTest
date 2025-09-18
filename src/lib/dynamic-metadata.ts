import { useEffect } from 'react'
import { siteConfig } from './metadata'

interface UseDynamicMetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  path?: string
}

export function useDynamicMetadata({
  title,
  description,
  keywords = [],
  path = ''
}: UseDynamicMetadataProps) {
  useEffect(() => {
    // Update document title
    const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
    document.title = pageTitle

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || siteConfig.description)
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = description || siteConfig.description
      document.head.appendChild(newMetaDescription)
    }

    // Update meta keywords
    const allKeywords = [...siteConfig.keywords, ...keywords].join(', ')
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', allKeywords)
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = allKeywords
      document.head.appendChild(newMetaKeywords)
    }

    // Update Open Graph meta tags
    const updateOgMeta = (property: string, content: string) => {
      const ogMeta = document.querySelector(`meta[property="${property}"]`)
      if (ogMeta) {
        ogMeta.setAttribute('content', content)
      } else {
        const newOgMeta = document.createElement('meta')
        newOgMeta.setAttribute('property', property)
        newOgMeta.setAttribute('content', content)
        document.head.appendChild(newOgMeta)
      }
    }

    updateOgMeta('og:title', pageTitle)
    updateOgMeta('og:description', description || siteConfig.description)
    updateOgMeta('og:url', `${siteConfig.url}${path}`)
    updateOgMeta('og:site_name', siteConfig.name)
    updateOgMeta('og:type', 'website')
    updateOgMeta('og:image', siteConfig.ogImage)

    // Update Twitter Card meta tags
    const updateTwitterMeta = (name: string, content: string) => {
      const twitterMeta = document.querySelector(`meta[name="${name}"]`)
      if (twitterMeta) {
        twitterMeta.setAttribute('content', content)
      } else {
        const newTwitterMeta = document.createElement('meta')
        newTwitterMeta.setAttribute('name', name)
        newTwitterMeta.setAttribute('content', content)
        document.head.appendChild(newTwitterMeta)
      }
    }

    updateTwitterMeta('twitter:card', 'summary_large_image')
    updateTwitterMeta('twitter:title', pageTitle)
    updateTwitterMeta('twitter:description', description || siteConfig.description)
    updateTwitterMeta('twitter:image', siteConfig.ogImage)

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    const canonicalUrl = `${siteConfig.url}${path}`
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl)
    } else {
      const newCanonical = document.createElement('link')
      newCanonical.rel = 'canonical'
      newCanonical.href = canonicalUrl
      document.head.appendChild(newCanonical)
    }

  }, [title, description, keywords, path])
}

// Predefined metadata configurations for different page types
export const dynamicPageMetadata = {
  driveRoot: (driveName?: string) => ({
    title: driveName ? `${driveName} - Google Drive` : 'Google Drive Files',
    description: `Access and manage files in ${driveName || 'your Google Drive'} with our beautiful and intuitive interface.`,
    keywords: ['google drive', 'file management', 'cloud storage', ...(driveName ? [driveName.toLowerCase()] : [])],
    path: '/drive'
  }),

  driveFolder: (folderName?: string, driveName?: string) => ({
    title: folderName ? `${folderName} - ${driveName || 'Drive'}` : 'Drive Folder',
    description: `Browse and manage files in the ${folderName || 'folder'} ${driveName ? `within ${driveName}` : ''}.`,
    keywords: ['folder', 'files', 'google drive', ...(folderName ? [folderName.toLowerCase()] : []), ...(driveName ? [driveName.toLowerCase()] : [])],
    path: '/drive'
  }),

  quiz: (department?: string) => ({
    title: department ? `${department} Quiz` : 'Quiz',
    description: `Test your knowledge in ${department || 'various subjects'} with our interactive quiz system.`,
    keywords: ['quiz', 'test', 'assessment', ...(department ? [department.toLowerCase()] : [])],
    path: '/quiz'
  }),

  specialization: (department?: string) => ({
    title: department ? `${department} Specialization` : 'Specializations',
    description: `Explore ${department || 'various'} specialization programs and career paths.`,
    keywords: ['specialization', 'career', 'education', ...(department ? [department.toLowerCase()] : [])],
    path: '/specialization'
  }),

  youtube: (playlistTitle?: string) => ({
    title: playlistTitle ? `${playlistTitle} - YouTube Playlist` : 'YouTube Playlists',
    description: `Watch and learn from the ${playlistTitle || 'curated'} video playlist.`,
    keywords: ['youtube', 'videos', 'playlist', 'learning', ...(playlistTitle ? [playlistTitle.toLowerCase()] : [])],
    path: '/youtube'
  }),

  dashboard: (userName?: string) => ({
    title: userName ? `${userName}'s Dashboard` : 'Dashboard',
    description: `Welcome to your personal learning dashboard. Track your progress and manage your courses.`,
    keywords: ['dashboard', 'progress', 'learning', 'courses', 'personal'],
    path: '/dashboard'
  })
}