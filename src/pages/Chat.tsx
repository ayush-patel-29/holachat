import { useState } from 'react'
import { main } from '../lib/groq'
import TextFormatter from '../components/TextFormatter'
import '../App.css'

const Chat = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [content, setContent] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getContent = async (): Promise<void> => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const res: string = await main(prompt)
      setPrompt('')
      setContent([res])
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        setContent([`Error: ${err.message}`])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-white h-full flex flex-col">
      <h1 className="w-full text-3xl text-center font-bold my-6">HolaChat is Fast Conversational Inference</h1>
      <div className="w-full max-h-[100vh] h-full flex items-center justify-center ">
        <div className="w-[70%] max-h-[80%] h-full border-2 relative rounded-xl ">
          <div className="w-full px-7 flex flex-row py-4 items-end">
            <textarea
              placeholder="Type Your Prompt"
              className="textArea "
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <button
              className={`w-[70px] text-white h-full flex justify-center items-center mb-2 ${
                (prompt.length === 0 || isLoading) && 'pointer-events-none cursor-not-allowed opacity-50'
              }`}
              onClick={getContent}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-white overflow-y-auto max-h-[80%] h-full content p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              content.map((response, idx) => <TextFormatter key={idx} prompt={response} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
