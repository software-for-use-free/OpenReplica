import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  PlusIcon, 
  RocketLaunchIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  TrashIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { sessionAPI, agentAPI } from '@/services/api'
import { useAppStore } from '@/stores/appStore'
import type { Session, CreateSessionRequest } from '@/types'
import toast from 'react-hot-toast'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setCurrentSessionId, llmProvider, llmModel, selectedAgent } = useAppStore()
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [formData, setFormData] = React.useState<CreateSessionRequest>({
    workspace_name: '',
    agent_type: selectedAgent,
    llm_provider: llmProvider,
    llm_model: llmModel,
  })

  // Fetch sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionAPI.list,
  })

  // Fetch agent types
  const { data: agentTypes } = useQuery({
    queryKey: ['agent-types'],
    queryFn: agentAPI.getTypes,
  })

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: sessionAPI.create,
    onSuccess: (session) => {
      setCurrentSessionId(session.session_id)
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session created successfully!')
      navigate(`/workspace/${session.session_id}`)
    },
    onError: (error) => {
      toast.error('Failed to create session')
      console.error('Create session error:', error)
    },
  })

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: sessionAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session deleted')
    },
    onError: () => {
      toast.error('Failed to delete session')
    },
  })

  const handleCreateSession = () => {
    if (!formData.workspace_name.trim()) {
      toast.error('Please enter a workspace name')
      return
    }
    createSessionMutation.mutate(formData)
  }

  const handleQuickStart = (agentType: string) => {
    const quickSession: CreateSessionRequest = {
      workspace_name: `Quick ${agentType} workspace`,
      agent_type: agentType,
      llm_provider: llmProvider,
      llm_model: llmModel,
    }
    createSessionMutation.mutate(quickSession)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                OpenReplica
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Your intelligent AI development companion. Create, code, and deploy with the power of advanced AI agents.
              </p>
            </div>
          </motion.div>

          {/* Quick Start Cards */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Quick Start
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  type: 'codeact',
                  title: 'Code Agent',
                  description: 'Write, edit, and debug code with AI assistance',
                  icon: CodeBracketIcon,
                  color: 'from-green-500 to-emerald-600',
                },
                {
                  type: 'browsing',
                  title: 'Web Agent',
                  description: 'Browse and interact with web content',
                  icon: GlobeAltIcon,
                  color: 'from-blue-500 to-cyan-600',
                },
                {
                  type: 'dummy',
                  title: 'Chat Agent',
                  description: 'Simple conversational AI assistant',
                  icon: ChatBubbleLeftRightIcon,
                  color: 'from-purple-500 to-pink-600',
                },
              ].map((agent) => (
                <motion.div
                  key={agent.type}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  onClick={() => handleQuickStart(agent.type)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-lg flex items-center justify-center mb-4`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {agent.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {agent.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <PlayIcon className="w-4 h-4 mr-1" />
                    Quick Start
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Create New Session */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Create New Session
                </h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Session</span>
                </button>
              </div>

              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={formData.workspace_name}
                      onChange={(e) => setFormData({ ...formData, workspace_name: e.target.value })}
                      placeholder="Enter workspace name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agent Type
                      </label>
                      <select
                        value={formData.agent_type}
                        onChange={(e) => setFormData({ ...formData, agent_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {agentTypes?.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LLM Provider
                      </label>
                      <select
                        value={formData.llm_provider}
                        onChange={(e) => setFormData({ ...formData, llm_provider: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="ollama">Ollama</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model
                      </label>
                      <select
                        value={formData.llm_model}
                        onChange={(e) => setFormData({ ...formData, llm_model: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="llama2">Llama 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSession}
                      disabled={createSessionMutation.isPending}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                      {createSessionMutation.isPending ? 'Creating...' : 'Create Session'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Sessions
            </h2>
            
            {sessionsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <motion.div
                    key={session.session_id}
                    whileHover={{ y: -2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer group"
                    onClick={() => {
                      setCurrentSessionId(session.session_id)
                      navigate(`/workspace/${session.session_id}`)
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <CpuChipIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {session.workspace_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.agent_type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSessionMutation.mutate(session.session_id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Messages:</span>
                        <span>{session.message_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span>{session.llm_model}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CpuChipIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No sessions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first session to get started with OpenReplica
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First Session
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
