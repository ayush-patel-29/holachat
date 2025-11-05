import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getHighlighter, type BundledLanguage } from 'shiki'
import { useEffect, useState } from 'react'

interface LLMMessageRendererProps {
  content: string
}

// Code block component with syntax highlighting
const CodeBlock = ({ 
  code, 
  language 
}: { 
  code: string
  language?: string 
}) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await getHighlighter({
          themes: ['github-dark'],
          langs: [language as BundledLanguage || 'text'],
        })
        
        const html = highlighter.codeToHtml(code, {
          lang: language || 'text',
          theme: 'github-dark',
        })
        
        setHighlightedCode(html)
      } catch (error) {
        console.error('Error highlighting code:', error)
        setHighlightedCode(`<pre><code>${code}</code></pre>`)
      }
    }

    highlightCode()
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative my-4 rounded-lg bg-[#0d1117] w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-gray-400 uppercase font-mono">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title="Copy code"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z" clipRule="evenodd" />
              <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
              <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
            </svg>
          )}
        </button>
      </div>
      <div className="w-full overflow-hidden">
        <div 
          className="overflow-x-auto p-4 w-full"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  )
}

const LLMMessageRenderer = ({ content }: LLMMessageRendererProps) => {
  return (
    <div className="llm-message text-white prose prose-invert w-full max-w-full overflow-hidden break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: any) {
            const inline = !className
            const match = /language-(\w+)/.exec(className || '')
            const codeContent = String(children).replace(/\n$/, '')
            
            if (!inline && match) {
              return <CodeBlock code={codeContent} language={match[1]} />
            }
            
            return (
              <code 
                className="bg-[#161b22] text-[#e6edf3] px-1.5 py-0.5 rounded text-sm font-mono break-all" 
                {...props}
              >
                {children}
              </code>
            )
          },
          p({ children }) {
            return <p className="mb-4 leading-7 text-white break-words">{children}</p>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-4 space-y-2 text-white">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-4 space-y-2 text-white">{children}</ol>
          },
          li({ children }) {
            return <li className="text-white break-words">{children}</li>
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold mb-4 text-white break-words">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mb-3 text-white break-words">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mb-2 text-white break-words">{children}</h3>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-300 break-words">
                {children}
              </blockquote>
            )
          },
          a({ children, href }) {
            return (
              <a 
                href={href} 
                className="text-blue-400 hover:text-blue-300 underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          strong({ children }) {
            return <strong className="font-bold text-yellow-300">{children}</strong>
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 max-w-full">
                <table className="border border-gray-600 w-full">
                  {children}
                </table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-[#161b22]">{children}</thead>
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>
          },
          tr({ children }) {
            return <tr className="border-b border-gray-600">{children}</tr>
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-white font-semibold border border-gray-600">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-white border border-gray-600">
                {children}
              </td>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default LLMMessageRenderer
