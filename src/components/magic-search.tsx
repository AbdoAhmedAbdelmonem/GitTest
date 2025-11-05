'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Sparkles, TrendingUp, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { departmentData } from '@/lib/department-data'

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  link: string
  code?: string
  creditHours?: number
  specialization?: string
}

const trendingSearches = [
  'Data Science',
  'Machine Learning',
  'Database',
  'Programming',
  'Calculus',
  'Linear Algebra',
]

const popularCategories = [
  { name: 'Computing', color: 'from-blue-500 to-cyan-500' },
  { name: 'Mathematics', color: 'from-purple-500 to-pink-500' },
  { name: 'Business', color: 'from-orange-500 to-red-500' },
  { name: 'Healthcare', color: 'from-green-500 to-emerald-500' },
]

// Build search index from department data
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []
  
  Object.entries(departmentData).forEach(([deptId, department]) => {
    Object.entries(department.levels).forEach(([levelNum, level]) => {
      // Process term1 subjects
      level.subjects.term1?.forEach((subject) => {
        results.push({
          id: subject.id,
          title: subject.name,
          description: subject.description,
          category: department.name,
          link: `/specialization/${deptId}/${levelNum}/${subject.id}`,
          code: subject.code,
          creditHours: subject.creditHours,
          specialization: deptId,
        })
      })
      
      // Process term2 subjects
      level.subjects.term2?.forEach((subject) => {
        results.push({
          id: subject.id,
          title: subject.name,
          description: subject.description,
          category: department.name,
          link: `/specialization/${deptId}/${levelNum}/${subject.id}`,
          code: subject.code,
          creditHours: subject.creditHours,
          specialization: deptId,
        })
      })
    })
  })
  
  return results
}

const allContent: SearchResult[] = buildSearchIndex()

// Debug: Log the number of subjects loaded
console.log(`Magic Search: Loaded ${allContent.length} subjects for search`)
if (allContent.length > 0) {
  console.log('Sample subjects:', allContent.slice(0, 5).map(s => s.title))
}

export default function MagicSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      const timeoutId = setTimeout(() => {
        const filtered = allContent.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filtered)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll' // Prevent layout shift
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      setSearchQuery(query)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        
        <Search className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors relative z-10" />
        <span className="text-white/60 group-hover:text-white/80 transition-colors relative z-10">
          Search anything...
        </span>
        <div className="flex items-center gap-1 relative z-10">
          <kbd className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60">K</kbd>
        </div>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={searchRef}
            className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top duration-300"
            style={{
              boxShadow: '0 0 80px rgba(99, 102, 241, 0.2), 0 0 40px rgba(236, 72, 153, 0.1)',
            }}
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-6 h-6 text-white/40" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    handleSearch(searchQuery)
                  }
                }}
                placeholder="Search for subjects, courses, topics..."
                className="w-full px-16 py-6 bg-transparent text-white text-lg placeholder:text-white/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              )}
              
              {/* Animated gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            </div>

            {/* Search Results / Suggestions */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
              {searchQuery ? (
                <>
                  {/* Loading State */}
                  {isSearching && (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {!isSearching && results.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm text-white/60 mb-3">
                        Found <span className="text-white font-semibold">{results.length}</span> subject{results.length !== 1 ? 's' : ''}
                      </div>
                      {results.map((result, index) => (
                        <Link
                          key={result.id}
                          href={result.link}
                          onClick={() => {
                            handleSearch(searchQuery)
                            setIsOpen(false)
                          }}
                          className="block group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-blue-400" />
                                  <span className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                                    {result.title}
                                  </span>
                                </div>
                                <p className="text-sm text-white/60 line-clamp-2 mb-2">{result.description}</p>
                                <div className="flex items-center gap-3 text-xs text-white/40">
                                  {result.code && (
                                    <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded">
                                      {result.code}
                                    </span>
                                  )}
                                  {result.creditHours && (
                                    <span>{result.creditHours} Credit Hours</span>
                                  )}
                                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                                    {result.category}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching && results.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-white/40" />
                      </div>
                      <p className="text-white/60 mb-2">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-sm text-white/40">Try searching with different keywords</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Searches
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-white/40 hover:text-white/60 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full text-sm text-white/80 transition-all duration-200"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-full text-sm text-white/80 hover:text-white transition-all duration-200"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Popular Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {popularCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(category.name)}
                          className="group relative p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 overflow-hidden"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                          />
                          <span className="relative text-white/80 group-hover:text-white font-medium">
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded">Enter</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded">Esc</kbd>
                    Close
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  Powered by <Sparkles className="w-3 h-3 text-purple-400" /> Magic Search
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
