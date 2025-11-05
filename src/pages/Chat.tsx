import { useState, useEffect, useRef } from 'react'
import { main } from '../lib/groq'
import LLMMessageRenderer from '../components/LLMMessageRenderer'
import Sidebar from '../components/Sidebar'
import { useChat } from '../context/ChatContext'
import { FiMenu } from 'react-icons/fi'
import '../App.css'

const Chat = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { currentSession, addMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset prompt when switching chats
  useEffect(() => {
    setPrompt('')
  }, [currentSession?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  const getContent = async (): Promise<void> => {
    if (!prompt.trim()) return

    const userPrompt = prompt
    setPrompt('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '24px'
    }
    
    // Add user message immediately
    await addMessage('user', userPrompt)
    setIsLoading(true)

    try {
      const res: string = await main(userPrompt)
      // Add assistant response
      await addMessage('assistant', res)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        await addMessage('assistant', `Error: ${err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      getContent()
    }
  }

  return (
    <div className="flex h-screen bg-[#001220] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px] h-screen">
        {/* Mobile Header with Menu Toggle */}
        <div className="lg:hidden flex items-center p-3 border-b border-[#031a2b]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#031a2b] transition"
          >
            <FiMenu size={20} className="text-white" />
          </button>
          <h1 className="ml-3 text-white font-semibold">HolaChat</h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {currentSession?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <h1 className="text-4xl font-semibold text-white mb-8">How can I help you today?</h1>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full px-4 py-6">
              {currentSession?.messages.map((message) => (
                <div key={message.id} className="mb-6">
                  {message.role === 'user' ? (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">U</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-white whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#031a2b] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">AI</span>
                      </div>
                      <div className="flex-1 pt-1 min-w-0 overflow-hidden">
                        <LLMMessageRenderer content={message.content} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#031a2b] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-gray-400 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="border-t border-[#031a2b] bg-[#001220]">
          <div className="max-w-2xl mx-auto w-full px-4 py-4">
            <div className="relative flex items-end gap-2 bg-[#001a2e] rounded-2xl shadow-[inset_4px_4px_8px_#00070d,inset_-4px_-4px_8px_#01233d] p-3">
              <textarea
                ref={textareaRef}
                placeholder="Message HolaChat..."
                className="flex-1 bg-transparent text-white resize-none outline-none placeholder-gray-500 custom-scrollbar"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  // Auto-resize textarea based on content
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={1}
                style={{
                  height: '24px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              />
              <button
                className={`p-2 rounded-lg transition flex-shrink-0 ${
                  prompt.trim().length === 0 || isLoading
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-200'
                }`}
                onClick={getContent}
                disabled={isLoading || prompt.trim().length === 0}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-800"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              HolaChat can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
