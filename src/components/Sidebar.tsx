import { FiPlus, FiTrash2, FiMessageSquare, FiSearch, FiLogOut, FiChevronUp, FiX } from 'react-icons/fi'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef, useMemo } from 'react'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { sessions, currentSessionId, createNewChat, switchChat, deleteChat } = useChat()
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  // Focus search input when search is activated
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions

    const query = searchQuery.toLowerCase()
    return sessions.filter((session) => {
      // Search in title
      if (session.title.toLowerCase().includes(query)) return true
      
      // Search in message content
      return session.messages.some((msg) =>
        msg.content.toLowerCase().includes(query)
      )
    })
  }, [sessions, searchQuery])

  return (
    <>
      {/* Sidebar - Always visible on desktop, toggle on mobile */}
      <div
        className={`fixed top-0 left-0 h-screen bg-[#001220] border-r border-[#031a2b] transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '260px' }}
      >
        {/* Header */}
        <div className="p-3 border-b border-[#031a2b]">
          <button
            onClick={() => createNewChat()}
            className="w-full px-3 py-2.5 rounded-lg bg-[#031a2b] text-white shadow-[4px_4px_8px_#00070d,-4px_-4px_8px_#01233d] hover:shadow-[inset_4px_4px_8px_#00070d,inset_-4px_-4px_8px_#01233d] transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FiPlus size={16} />
            New chat
          </button>
        </div>

        {/* Search Section */}
        <div className="px-3 py-2 space-y-1">
          {isSearching ? (
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pr-8 rounded-lg bg-[#031a2b] text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
              />
              <button
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery('')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#001a2e] transition"
              >
                <FiX size={14} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-[#031a2b] transition flex items-center gap-3 text-sm"
            >
              <FiSearch size={16} />
              Search chats
            </button>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-gray-500 text-xs font-semibold mb-2 px-3">
            {searchQuery ? `Results (${filteredSessions.length})` : 'Chats'}
          </div>
          {filteredSessions.length === 0 ? (
            <div className="px-3 py-4 text-center text-gray-500 text-sm">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative px-3 py-2 rounded-lg cursor-pointer transition flex items-center gap-2 ${
                    session.id === currentSessionId
                      ? 'bg-[#031a2b]'
                      : 'hover:bg-[#001a2e]'
                  }`}
                  onClick={() => switchChat(session.id)}
                >
                  <FiMessageSquare size={14} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{session.title}</p>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (window.confirm('Delete this chat?')) {
                        await deleteChat(session.id)
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition flex-shrink-0"
                    aria-label="Delete chat"
                  >
                    <FiTrash2 size={12} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={userMenuRef} className="relative p-3 border-t border-[#031a2b]">
          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#001a2e] border border-[#031a2b] rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  signOut()
                  setShowUserMenu(false)
                }}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/20 transition flex items-center gap-3 text-sm"
              >
                <FiLogOut size={16} />
                Log out
              </button>
            </div>
          )}
          
          {/* User Profile Button */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#031a2b] transition"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm truncate">{user?.email || 'User'}</p>
            </div>
            <FiChevronUp
              size={16}
              className={`text-gray-400 transition-transform flex-shrink-0 ${
                showUserMenu ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
