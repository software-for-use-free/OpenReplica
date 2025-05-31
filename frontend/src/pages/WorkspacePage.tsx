import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CommandLineIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { sessionAPI } from '@/services/api'
import { useWebSocket } from '@/services/websocket'
import { useAppStore } from '@/stores/appStore'
import ChatPanel from '@/components/workspace/ChatPanel'
import FileExplorer from '@/components/workspace/FileExplorer'
import CodeEditor from '@/components/workspace/CodeEditor'
import Terminal from '@/components/workspace/Terminal'
import AgentStatus from '@/components/workspace/AgentStatus'
import { cn } from '@/lib/utils'

type PanelType = 'chat' | 'files' | 'editor' | 'terminal'

const WorkspacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { setCurrentSessionId, panelSizes, setPanelSizes } = useAppStore()
  const [activePanel, setActivePanel] = React.useState<PanelType>('chat')
  const [openFiles, setOpenFiles] = React.useState<string[]>([])
  const [activeFile, setActiveFile] = React.useState<string | null>(null)

  // Set current session
  React.useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId)
    }
  }, [sessionId, setCurrentSessionId])

  // Fetch session data
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionAPI.get(sessionId!),
    enabled: !!sessionId,
  })

  // WebSocket connection
  const websocket = useWebSocket(sessionId || null)

  const panelTabs = [
    {
      id: 'chat' as PanelType,
      label: 'Chat',
      icon: ChatBubbleLeftRightIcon,
      badge: 3,
    },
    {
      id: 'files' as PanelType,
      label: 'Files',
      icon: DocumentTextIcon,
    },
    {
      id: 'terminal' as PanelType,
      label: 'Terminal',
      icon: CommandLineIcon,
    },
  ]

  const openFile = (filePath: string) => {
    if (!openFiles.includes(filePath)) {
      setOpenFiles([...openFiles, filePath])
    }
    setActiveFile(filePath)
    setActivePanel('editor')
  }

  const closeFile = (filePath: string) => {
    const newOpenFiles = openFiles.filter(f => f !== filePath)
    setOpenFiles(newOpenFiles)
    
    if (activeFile === filePath) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Session not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested session could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Left Panel */}
      <motion.div
        initial={false}
        animate={{ width: `${panelSizes.sidebar}%` }}
        className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
      >
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {panelTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activePanel === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {activePanel === 'chat' && (
            <ChatPanel sessionId={sessionId!} websocket={websocket} />
          )}
          {activePanel === 'files' && (
            <FileExplorer sessionId={sessionId!} onFileSelect={openFile} />
          )}
          {activePanel === 'terminal' && (
            <Terminal sessionId={sessionId!} />
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {session.workspace_name}
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {session.agent_type}
            </span>
          </div>
          <AgentStatus sessionId={sessionId!} />
        </div>

        {/* Editor Tabs */}
        {openFiles.length > 0 && (
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {openFiles.map((file) => (
              <div
                key={file}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm border-r border-gray-200 dark:border-gray-700 cursor-pointer",
                  activeFile === file
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setActiveFile(file)}
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>{file.split('/').pop()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeFile(file)
                  }}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Editor/Content */}
        <div className="flex-1 overflow-hidden">
          {activeFile ? (
            <CodeEditor 
              sessionId={sessionId!} 
              filePath={activeFile}
              onFileChange={(path) => {
                // Handle file changes
                console.log('File changed:', path)
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No file open
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a file from the explorer to start editing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkspacePage
