import React from 'react'
import { motion } from 'framer-motion'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { 
  CommandLineIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import '@xterm/xterm/css/xterm.css'

interface TerminalProps {
  sessionId: string
}

interface TerminalSession {
  id: string
  title: string
  terminal: XTerm
  fitAddon: FitAddon
  connected: boolean
}

const Terminal: React.FC<TerminalProps> = ({ sessionId }) => {
  const { theme } = useAppStore()
  const [sessions, setSessions] = React.useState<TerminalSession[]>([])
  const [activeSessionId, setActiveSessionId] = React.useState<string>('')
  const terminalRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  // Create new terminal session
  const createTerminalSession = React.useCallback(() => {
    const id = `terminal-${Date.now()}`
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: theme === 'dark' ? '#1e293b' : '#ffffff',
        foreground: theme === 'dark' ? '#f8fafc' : '#1e293b',
        cursor: theme === 'dark' ? '#f8fafc' : '#1e293b',
        selection: theme === 'dark' ? '#374151' : '#e5e7eb',
      },
      rows: 24,
      cols: 80,
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    const session: TerminalSession = {
      id,
      title: `Terminal ${sessions.length + 1}`,
      terminal,
      fitAddon,
      connected: false,
    }

    setSessions(prev => [...prev, session])
    setActiveSessionId(id)

    // Simulate terminal connection
    setTimeout(() => {
      terminal.writeln('Welcome to OpenReplica Terminal')
      terminal.writeln('Connected to workspace: ' + sessionId)
      terminal.writeln('')
      terminal.write('$ ')
      
      setSessions(prev => prev.map(s => 
        s.id === id ? { ...s, connected: true } : s
      ))
    }, 500)

    return session
  }, [sessionId, sessions.length, theme])

  // Close terminal session
  const closeTerminalSession = (sessionId: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== sessionId)
      const session = prev.find(s => s.id === sessionId)
      if (session) {
        session.terminal.dispose()
      }
      
      if (activeSessionId === sessionId && newSessions.length > 0) {
        setActiveSessionId(newSessions[0].id)
      } else if (newSessions.length === 0) {
        setActiveSessionId('')
      }
      
      return newSessions
    })
  }

  // Initialize terminal DOM
  React.useEffect(() => {
    sessions.forEach(session => {
      const terminalElement = terminalRefs.current.get(session.id)
      if (terminalElement && !terminalElement.hasChildNodes()) {
        session.terminal.open(terminalElement)
        session.fitAddon.fit()

        // Handle terminal input
        session.terminal.onData(data => {
          // Simulate command handling
          if (data === '\r') {
            session.terminal.writeln('')
            session.terminal.write('$ ')
          } else if (data === '\u007f') { // Backspace
            session.terminal.write('\b \b')
          } else {
            session.terminal.write(data)
          }
        })
      }
    })
  }, [sessions])

  // Handle resize
  React.useEffect(() => {
    const handleResize = () => {
      sessions.forEach(session => {
        if (session.fitAddon) {
          session.fitAddon.fit()
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sessions])

  // Create initial terminal if none exist
  React.useEffect(() => {
    if (sessions.length === 0) {
      createTerminalSession()
    }
  }, [createTerminalSession, sessions.length])

  const activeSession = sessions.find(s => s.id === activeSessionId)

  return (
    <div className="h-full flex flex-col">
      {/* Terminal tabs */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex items-center overflow-x-auto">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-700 cursor-pointer",
                activeSessionId === session.id
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={() => setActiveSessionId(session.id)}
            >
              <CommandLineIcon className="w-4 h-4" />
              <span>{session.title}</span>
              
              {/* Connection indicator */}
              <div className={cn(
                "w-2 h-2 rounded-full",
                session.connected ? "bg-green-500" : "bg-red-500"
              )} />

              {/* Close button */}
              {sessions.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTerminalSession(session.id)
                  }}
                  className="ml-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Terminal controls */}
        <div className="flex items-center space-x-1 px-3">
          <button
            onClick={createTerminalSession}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="New terminal"
          >
            <PlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          {activeSession && (
            <button
              onClick={() => {
                // Restart terminal
                activeSession.terminal.clear()
                activeSession.terminal.writeln('Terminal restarted')
                activeSession.terminal.write('$ ')
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Restart terminal"
            >
              <ArrowPathIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal content */}
      <div className="flex-1 relative overflow-hidden">
        {sessions.map((session) => (
          <div
            key={session.id}
            ref={(el) => {
              if (el) {
                terminalRefs.current.set(session.id, el)
              }
            }}
            className={cn(
              "absolute inset-0 bg-white dark:bg-gray-900",
              activeSessionId === session.id ? "block" : "hidden"
            )}
            style={{ 
              padding: '8px',
              fontFamily: 'Menlo, Monaco, "Courier New", monospace'
            }}
          />
        ))}

        {/* Terminal loading state */}
        {activeSession && !activeSession.connected && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Connecting to terminal...</p>
            </div>
          </div>
        )}

        {/* No terminals state */}
        {sessions.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <CommandLineIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No terminals open
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a new terminal to start executing commands
              </p>
              <button
                onClick={createTerminalSession}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Terminal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terminal status */}
      {activeSession && (
        <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Session: {sessionId.slice(0, 8)}</span>
            <span>Shell: bash</span>
            <span>PWD: /workspace</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Encoding: UTF-8</span>
            <span>Size: 80x24</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Terminal
