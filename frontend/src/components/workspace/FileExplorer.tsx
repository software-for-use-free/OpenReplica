import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { fileAPI } from '@/services/api'
import type { FileInfo, DirectoryListing } from '@/types'
import { cn, getFileIcon, formatFileSize, formatRelativeTime } from '@/lib/utils'

interface FileExplorerProps {
  sessionId: string
  onFileSelect: (filePath: string) => void
}

interface FileTreeNode extends FileInfo {
  children?: FileTreeNode[]
  expanded?: boolean
  level: number
}

const FileExplorer: React.FC<FileExplorerProps> = ({ sessionId, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set(['/']))
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentPath, setCurrentPath] = React.useState('')

  // Fetch directory listing
  const { data: directoryListing, isLoading, error } = useQuery({
    queryKey: ['files', sessionId, currentPath],
    queryFn: () => fileAPI.list(sessionId, currentPath),
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  // Build file tree
  const buildFileTree = (files: FileInfo[], basePath: string = '', level: number = 0): FileTreeNode[] => {
    return files.map(file => ({
      ...file,
      level,
      expanded: expandedFolders.has(file.path),
      children: file.is_directory ? [] : undefined,
    }))
  }

  const toggleFolder = async (folderPath: string, isExpanded: boolean) => {
    const newExpanded = new Set(expandedFolders)
    
    if (isExpanded) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    
    setExpandedFolders(newExpanded)
  }

  const filteredFiles = React.useMemo(() => {
    if (!directoryListing?.files) return []
    
    if (!searchQuery.trim()) {
      return buildFileTree(directoryListing.files)
    }
    
    return buildFileTree(
      directoryListing.files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [directoryListing?.files, searchQuery, expandedFolders])

  const renderFileNode = (node: FileTreeNode) => {
    const isExpanded = node.expanded
    const Icon = node.is_directory ? (isExpanded ? FolderOpenIcon : FolderIcon) : DocumentTextIcon

    return (
      <div key={node.path}>
        <motion.div
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          className={cn(
            "flex items-center px-2 py-1 cursor-pointer rounded text-sm group",
            "hover:bg-blue-50 dark:hover:bg-blue-900/20"
          )}
          style={{ paddingLeft: `${8 + node.level * 16}px` }}
          onClick={() => {
            if (node.is_directory) {
              toggleFolder(node.path, isExpanded)
            } else {
              onFileSelect(node.path)
            }
          }}
        >
          {/* Expand/collapse icon for directories */}
          {node.is_directory && (
            <div className="w-4 h-4 mr-1 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDownIcon className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}

          {/* File/folder icon */}
          <Icon className={cn(
            "w-4 h-4 mr-2 flex-shrink-0",
            node.is_directory 
              ? "text-blue-500 dark:text-blue-400" 
              : "text-gray-500 dark:text-gray-400"
          )} />

          {/* File/folder name */}
          <span className="flex-1 truncate text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
            {node.name}
          </span>

          {/* File size for files */}
          {!node.is_directory && (
            <span className="text-xs text-gray-400 ml-2">
              {formatFileSize(node.size)}
            </span>
          )}

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Handle delete
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            >
              <TrashIcon className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </motion.div>

        {/* Children for expanded directories */}
        <AnimatePresence>
          {node.is_directory && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* This would normally fetch and render subdirectory contents */}
              <div className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
                Loading...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading files
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Could not load the file explorer
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Files
        </h3>
        <div className="flex items-center space-x-1">
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="New file"
          >
            <PlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 py-2 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="py-2">
            {filteredFiles.map(renderFileNode)}
          </div>
        ) : (
          <div className="p-4 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No files found' : 'No files in this directory'}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      {directoryListing && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>{directoryListing.total_files} files</span>
            <span>{formatFileSize(directoryListing.total_size)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileExplorer
