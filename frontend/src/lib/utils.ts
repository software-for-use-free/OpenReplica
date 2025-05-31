import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  
  return formatDate(date)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        textArea.remove()
        resolve()
      } else {
        textArea.remove()
        reject(new Error('Copy failed'))
      }
    })
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  const ext = filename.toLowerCase().substr(filename.lastIndexOf('.'))
  return imageExtensions.includes(ext)
}

export function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php',
    '.rb', '.go', '.rust', '.swift', '.kt', '.scala', '.sh', '.bash', '.zsh',
    '.html', '.css', '.scss', '.less', '.json', '.xml', '.yaml', '.yml',
    '.sql', '.md', '.txt', '.log', '.gitignore', '.env'
  ]
  const ext = filename.toLowerCase().substr(filename.lastIndexOf('.'))
  return codeExtensions.includes(ext)
}

export function getFileIcon(filename: string): string {
  if (isImageFile(filename)) return '🖼️'
  if (isCodeFile(filename)) return '📄'
  
  const ext = filename.toLowerCase().substr(filename.lastIndexOf('.'))
  
  switch (ext) {
    case '.pdf': return '📕'
    case '.zip': case '.rar': case '.7z': return '📦'
    case '.mp3': case '.wav': case '.ogg': return '🎵'
    case '.mp4': case '.avi': case '.mov': return '🎬'
    case '.doc': case '.docx': return '📝'
    case '.xls': case '.xlsx': return '📊'
    case '.ppt': case '.pptx': return '📈'
    default: return '📄'
  }
}
