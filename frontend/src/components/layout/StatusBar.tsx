import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CpuChipIcon,
  WifiIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

const StatusBar: React.FC = () => {
  const { connected, currentSessionId, selectedAgent, llmProvider, llmModel } = useAppStore()
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-6 bg-blue-600 dark:bg-blue-700 text-white text-xs flex items-center justify-between px-4">
      {/* Left side - Status indicators */}
      <div className="flex items-center space-x-4">
        {/* Connection status */}
        <div className="flex items-center space-x-1">
          <WifiIcon className={cn(
            "w-3 h-3",
            connected ? "text-green-300" : "text-red-300"
          )} />
          <span>{connected ? "Connected" : "Disconnected"}</span>
        </div>

        {/* Current session */}
        {currentSessionId && (
          <div className="flex items-center space-x-1">
            <span>Session:</span>
            <span className="font-mono">{currentSessionId.slice(0, 8)}</span>
          </div>
        )}

        {/* Agent status */}
        <div className="flex items-center space-x-1">
          <CpuChipIcon className="w-3 h-3" />
          <span>{selectedAgent}</span>
        </div>

        {/* LLM info */}
        <div className="flex items-center space-x-1">
          <span>{llmProvider}</span>
          <span className="text-blue-200">/</span>
          <span>{llmModel}</span>
        </div>
      </div>

      {/* Center - Current activity */}
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3"
        >
          <ClockIcon className="w-3 h-3" />
        </motion.div>
        <span>Ready</span>
      </div>

      {/* Right side - System info */}
      <div className="flex items-center space-x-4">
        {/* Performance indicator */}
        <div className="flex items-center space-x-1">
          <span>CPU: 12%</span>
          <div className="w-8 h-1 bg-blue-800 rounded-full">
            <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
          </div>
        </div>

        {/* Memory usage */}
        <div className="flex items-center space-x-1">
          <span>RAM: 2.1GB</span>
          <div className="w-8 h-1 bg-blue-800 rounded-full">
            <div className="w-2 h-1 bg-blue-200 rounded-full"></div>
          </div>
        </div>

        {/* Current time */}
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-3 h-3" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
