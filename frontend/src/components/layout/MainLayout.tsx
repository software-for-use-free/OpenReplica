import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import StatusBar from './StatusBar'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarCollapsed, theme } = useAppStore()

  return (
    <div className={cn('h-screen flex flex-col overflow-hidden', theme)}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            width: sidebarCollapsed ? 64 : 280,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}

export default MainLayout
