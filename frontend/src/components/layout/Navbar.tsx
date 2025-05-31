import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Bars3Icon, 
  PlusIcon, 
  CogIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

const Navbar: React.FC = () => {
  const location = useLocation()
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    theme, 
    setTheme,
    connected 
  } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {/* Menu toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OR</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-lg">
            OpenReplica
          </span>
        </Link>

        {/* Connection status */}
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            connected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Center - Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {location.pathname === '/' && <span>Home</span>}
        {location.pathname.startsWith('/workspace') && (
          <>
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Workspace</span>
          </>
        )}
        {location.pathname === '/settings' && (
          <>
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Settings</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {/* New session button */}
        {location.pathname !== '/' && (
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Session</span>
          </Link>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41L6.7 7.1c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zM18.36 16.95c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l2.12 2.12c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-2.12-2.12zm-12.37 0l-2.12 2.12c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l2.12-2.12c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0zm12.37-12.37l2.12-2.12c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-2.12 2.12c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/>
            </svg>
          )}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Settings"
        >
          <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>

        {/* User menu */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="User menu"
        >
          <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
