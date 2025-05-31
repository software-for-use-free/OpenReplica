import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionAPI } from '@/services/api'
import type { ChatMessage } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import toast from 'react-hot-toast'

interface ChatPanelProps {
  sessionId: string
  websocket: any
}

const ChatPanel: React.FC<ChatPanelProps> = ({ sessionId, websocket }) => {
  const queryClient = useQueryClient()
  const [message, setMessage] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: () => sessionAPI.getMessages(sessionId),
    refetchInterval: 2000, // Poll for new messages
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, role }: { content: string; role: string }) =>
      sessionAPI.addMessage(sessionId, content, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', sessionId] })
      setMessage('')
      setIsTyping(false)
    },
    onError: () => {
      toast.error('Failed to send message')
      setIsTyping(false)
    },
  })

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // WebSocket message handling
  React.useEffect(() => {
    if (websocket) {
      const unsubscribe = websocket.on('agent_message', (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['messages', sessionId] })
      })

      return unsubscribe
    }
  }, [websocket, queryClient, sessionId])

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsTyping(true)
    sendMessageMutation.mutate({ content: message, role: 'user' })

    // Send via WebSocket for real-time processing
    if (websocket) {
      websocket.sendUserMessage(message)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages?.map((msg: any, index: number) => (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  }`}>
                    {msg.role === 'user' ? (
                      <UserIcon className="w-4 h-4 text-white" />
                    ) : (
                      <CpuChipIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Message content */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                        className="prose dark:prose-invert max-w-none text-sm"
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {formatRelativeTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex mr-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <CpuChipIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              disabled={sendMessageMutation.isPending}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>

        {/* Connection status */}
        {!websocket?.isConnected && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-amber-600 dark:text-amber-400">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>Not connected to WebSocket. Messages may not be delivered in real-time.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPanel
