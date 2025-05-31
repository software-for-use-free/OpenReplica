import React from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  DocumentTextIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { fileAPI } from '@/services/api'
import { useAppStore } from '@/stores/appStore'
import { debounce } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CodeEditorProps {
  sessionId: string
  filePath: string
  onFileChange?: (filePath: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ sessionId, filePath, onFileChange }) => {
  const { theme } = useAppStore()
  const queryClient = useQueryClient()
  const [content, setContent] = React.useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)

  // Fetch file content
  const { data: fileContent, isLoading, error } = useQuery({
    queryKey: ['file-content', sessionId, filePath],
    queryFn: () => fileAPI.read(sessionId, filePath),
    enabled: !!filePath,
  })

  // Save file mutation
  const saveFileMutation = useMutation({
    mutationFn: (content: string) => 
      fileAPI.write(sessionId, { path: filePath, content }),
    onSuccess: () => {
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      toast.success('File saved')
      queryClient.invalidateQueries({ queryKey: ['files', sessionId] })
      onFileChange?.(filePath)
    },
    onError: () => {
      toast.error('Failed to save file')
    },
  })

  // Update content when file data loads
  React.useEffect(() => {
    if (fileContent?.content && fileContent.content !== content) {
      setContent(fileContent.content)
      setHasUnsavedChanges(false)
    }
  }, [fileContent])

  // Debounced auto-save
  const debouncedSave = React.useMemo(
    () => debounce((content: string) => {
      if (hasUnsavedChanges && content !== fileContent?.content) {
        saveFileMutation.mutate(content)
      }
    }, 2000),
    [hasUnsavedChanges, fileContent?.content, saveFileMutation]
  )

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      setHasUnsavedChanges(value !== fileContent?.content)
      debouncedSave(value)
    }
  }

  const handleSave = () => {
    if (hasUnsavedChanges) {
      saveFileMutation.mutate(content)
    }
  }

  const getLanguage = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sql': 'sql',
      'md': 'markdown',
      'txt': 'plaintext',
    }
    return languageMap[ext || ''] || 'plaintext'
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading file...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading file
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Could not load {filePath}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['file-content', sessionId, filePath] })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor header */}
      <div className="h-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {filePath.split('/').pop()}
          </span>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
          )}
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          {lastSaved && (
            <div className="flex items-center space-x-1">
              <CheckIcon className="w-3 h-3 text-green-500" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span>{getLanguage(filePath)}</span>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saveFileMutation.isPending}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors"
            >
              {saveFileMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(filePath)}
          value={content}
          onChange={handleContentChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            parameterHints: {
              enabled: true,
            },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            mouseWheelZoom: true,
            multiCursorModifier: 'ctrlCmd',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
