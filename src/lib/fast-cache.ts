// Fast cache utility for drive files
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 100

interface CacheItem<T> {
  data: T
  timestamp: number
  key: string
}

class FastCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private accessOrder: string[] = []

  set(key: string, data: T): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = this.accessOrder.shift()
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    })

    // Update access order
    const existingIndex = this.accessOrder.indexOf(key)
    if (existingIndex > -1) {
      this.accessOrder.splice(existingIndex, 1)
    }
    this.accessOrder.push(key)
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.delete(key)
      return null
    }

    // Update access order
    const existingIndex = this.accessOrder.indexOf(key)
    if (existingIndex > -1) {
      this.accessOrder.splice(existingIndex, 1)
      this.accessOrder.push(key)
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  // Get fresh data check
  isStale(key: string, maxAge: number = CACHE_DURATION): boolean {
    const item = this.cache.get(key)
    if (!item) return true
    return Date.now() - item.timestamp > maxAge
  }
}

// Global cache instances
export const filesCache = new FastCache<any[]>()
export const folderInfoCache = new FastCache<any>()
export const userSessionCache = new FastCache<any>()

// Cache keys
export const getCacheKey = {
  files: (folderId: string, isAdmin: boolean) => `files-${folderId}-${isAdmin}`,
  folderInfo: (folderId: string, isAdmin: boolean) => `folder-${folderId}-${isAdmin}`,
  userSession: (userId: string) => `session-${userId}`,
  adminStatus: (userId: string) => `admin-${userId}`
}