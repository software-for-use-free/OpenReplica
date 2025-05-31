import React from 'react'
import { motion } from 'framer-motion'
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  PaintBrushIcon,
  KeyIcon,
  ServerIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type SettingsSection = 'general' | 'appearance' | 'llm' | 'notifications' | 'security' | 'about'

const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    llmProvider,
    llmModel,
    setLLMSettings,
    selectedAgent,
    setSelectedAgent,
  } = useAppStore()

  const [activeSection, setActiveSection] = React.useState<SettingsSection>('general')
  const [settings, setSettings] = React.useState({
    username: 'OpenReplica User',
    email: 'user@example.com',
    autoSave: true,
    notifications: {
      desktop: true,
      sound: false,
      taskComplete: true,
      errors: true,
    },
    editor: {
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      minimap: true,
      lineNumbers: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
  })

  const sections = [
    {
      id: 'general' as SettingsSection,
      title: 'General',
      icon: CogIcon,
    },
    {
      id: 'appearance' as SettingsSection,
      title: 'Appearance',
      icon: PaintBrushIcon,
    },
    {
      id: 'llm' as SettingsSection,
      title: 'AI Models',
      icon: ServerIcon,
    },
    {
      id: 'notifications' as SettingsSection,
      title: 'Notifications',
      icon: BellIcon,
    },
    {
      id: 'security' as SettingsSection,
      title: 'Security',
      icon: ShieldCheckIcon,
    },
    {
      id: 'about' as SettingsSection,
      title: 'About',
      icon: InformationCircleIcon,
    },
  ]

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Default Agent
        </h3>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="codeact">Code Agent</option>
          <option value="browsing">Web Agent</option>
          <option value="dummy">Chat Agent</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Preferences
        </h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Auto-save files
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme('light')}
            className={cn(
              "p-4 border-2 rounded-lg text-left transition-colors",
              theme === 'light'
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="w-12 h-8 bg-white border border-gray-200 rounded mb-2"></div>
            <div className="font-medium text-gray-900 dark:text-white">Light</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Clean and bright</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme('dark')}
            className={cn(
              "p-4 border-2 rounded-lg text-left transition-colors",
              theme === 'dark'
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="w-12 h-8 bg-gray-900 border border-gray-700 rounded mb-2"></div>
            <div className="font-medium text-gray-900 dark:text-white">Dark</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</div>
          </motion.button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Editor Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <select
              value={settings.editor.fontSize}
              onChange={(e) => setSettings({
                ...settings,
                editor: { ...settings.editor, fontSize: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tab Size
            </label>
            <select
              value={settings.editor.tabSize}
              onChange={(e) => setSettings({
                ...settings,
                editor: { ...settings.editor, tabSize: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { key: 'wordWrap', label: 'Word wrap' },
            { key: 'minimap', label: 'Show minimap' },
            { key: 'lineNumbers', label: 'Show line numbers' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={settings.editor[key as keyof typeof settings.editor] as boolean}
                onChange={(e) => setSettings({
                  ...settings,
                  editor: { ...settings.editor, [key]: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLLMSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Default LLM Provider
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Provider
            </label>
            <select
              value={llmProvider}
              onChange={(e) => setLLMSettings(e.target.value, llmModel)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="ollama">Ollama (Local)</option>
              <option value="azure">Azure OpenAI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <select
              value={llmModel}
              onChange={(e) => setLLMSettings(llmProvider, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {llmProvider === 'openai' && (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {llmProvider === 'anthropic' && (
                <>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </>
              )}
              {llmProvider === 'ollama' && (
                <>
                  <option value="llama2">Llama 2</option>
                  <option value="codellama">Code Llama</option>
                  <option value="mistral">Mistral</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              API Keys Required
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You'll need to configure API keys for external providers in the Security section.
              Local providers like Ollama don't require API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { key: 'desktop', label: 'Desktop notifications', description: 'Show notifications in your system tray' },
            { key: 'sound', label: 'Sound notifications', description: 'Play sounds for important events' },
            { key: 'taskComplete', label: 'Task completion', description: 'Notify when agent tasks are completed' },
            { key: 'errors', label: 'Error notifications', description: 'Notify when errors occur' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications[key as keyof typeof settings.notifications]}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, [key]: e.target.checked }
                })}
                className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          API Keys
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Session Security
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
              })}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactor}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, twoFactor: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable two-factor authentication
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderAboutSettings = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">OR</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          OpenReplica
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Version 1.0.0
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Built With
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>React 18</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>FastAPI</li>
            <li>WebSocket</li>
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Resources
          </h4>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                GitHub Repository
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Report Issues
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'llm':
        return renderLLMSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'about':
        return renderAboutSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
        </div>
        <nav className="px-2 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                activeSection === section.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>

          {/* Save button */}
          {activeSection !== 'about' && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
