import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  CpuChipIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { sessionAPI } from '@/services/api'
import { cn } from '@/lib/utils'

interface AgentStatusProps {
  sessionId: string
}

const AgentStatus: React.FC<AgentStatusProps> = ({ sessionId }) => {
  // Fetch session data to get agent status
  const { data: session } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionAPI.get(sessionId),
    refetchInterval: 3000, // Poll every 3 seconds
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return <PlayIcon className="w-4 h-4" />
      case 'paused':
        return <PauseIcon className="w-4 h-4" />
      case 'stopped':
        return <StopIcon className="w-4 h-4" />
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'text-green-600 dark:text-green-400'
      case 'paused':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'stopped':
        return 'text-gray-600 dark:text-gray-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'completed':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'paused':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'stopped':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'completed':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
    }
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-lg border",
        getStatusBackground(session.status)
      )}
    >
      {/* Agent icon */}
      <div className="flex items-center space-x-2">
        <CpuChipIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {session.agent_type}
        </span>
      </div>

      {/* Status indicator */}
      <div className="flex items-center space-x-2">
        <motion.div
          animate={session.status === 'active' ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: session.status === 'active' ? Infinity : 0, ease: "linear" }}
          className={cn("flex-shrink-0", getStatusColor(session.status))}
        >
          {getStatusIcon(session.status)}
        </motion.div>
        
        <span className={cn("text-sm font-medium capitalize", getStatusColor(session.status))}>
          {session.status}
        </span>
      </div>

      {/* Model info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-600 pl-3">
        <div>{session.llm_provider}</div>
        <div>{session.llm_model}</div>
      </div>

      {/* Message count */}
      <div className="text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-600 pl-3">
        <div>{session.message_count} messages</div>
        <div>{new Date(session.last_activity).toLocaleTimeString()}</div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-1 border-l border-gray-200 dark:border-gray-600 pl-3">
        {session.status === 'active' ? (
          <button
            className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded transition-colors"
            title="Pause agent"
          >
            <PauseIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </button>
        ) : session.status === 'paused' ? (
          <button
            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
            title="Resume agent"
          >
            <PlayIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          </button>
        ) : null}
        
        <button
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Stop agent"
        >
          <StopIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default AgentStatus
