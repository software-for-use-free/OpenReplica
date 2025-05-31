import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  FolderIcon,
  CommandLineIcon,
  ClockIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  badge?: number
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'chat',
    label: 'Chat',
    icon: ChatBubbleLeftRightIcon,
    badge: 3,
  },
  {
    id: 'files',
    label: 'Files',
    icon: FolderIcon,
    children: [
      { id: 'explorer', label: 'Explorer', icon: FolderIcon },
      { id: 'search', label: 'Search', icon: DocumentTextIcon },
    ],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: CommandLineIcon,
  },
  {
    id: 'history',
    label: 'History',
    icon: ClockIcon,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Cog6ToothIcon,
  },
]

const Sidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set(['files']))
  const [activeItem, setActiveItem] = React.useState('chat')

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isActive = activeItem === item.id

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              setActiveItem(item.id)
            }
          }}
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            isActive && !hasChildren && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: sidebarCollapsed ? 12 : 12 + (level * 16) }}
        >
          <item.icon className={cn(
            "flex-shrink-0 transition-colors",
            sidebarCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3",
            isActive && !hasChildren 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
          )} />
          
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between flex-1 overflow-hidden"
              >
                <span className={cn(
                  "text-gray-700 dark:text-gray-300 truncate",
                  isActive && !hasChildren && "text-blue-700 dark:text-blue-300"
                )}>
                  {item.label}
                </span>
                
                <div className="flex items-center space-x-2">
                  {item.badge && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  
                  {hasChildren && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children?.map(child => renderSidebarItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar content */}
      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map(item => renderSidebarItem(item))}
      </div>

      {/* Sidebar footer */}
      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>2.1 GB</span>
            </div>
            <div className="flex justify-between">
              <span>CPU:</span>
              <span>12%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
              <div className="bg-blue-500 h-1 rounded-full w-[12%]"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Sidebar
