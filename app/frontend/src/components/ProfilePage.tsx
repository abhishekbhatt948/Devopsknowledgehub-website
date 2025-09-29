import React, { useState } from 'react'
import { ArrowLeft, User, Mail, Calendar, Award, TrendingUp, Code, Target, Clock, CheckCircle, Star, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../hooks/useProgress'

interface ProfilePageProps {
  onBack: () => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user, profile, updateProfile } = useAuth()
  const { progress, achievements, codeExecutions, getOverallStats } = useProgress()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)

  const stats = getOverallStats()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateProfile({ full_name: fullName })
    
    if (!error) {
      setIsEditing(false)
    }
    
    setLoading(false)
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'tool_completion':
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 'first_step':
        return <Target className="w-6 h-6 text-blue-500" />
      case 'first_success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'expert_user':
        return <Star className="w-6 h-6 text-purple-500" />
      default:
        return <Award className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile?.full_name || 'DevOps Learner'}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tools Completed</span>
                  <span className="font-semibold text-green-600">{stats.completedTools}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{stats.inProgressTools}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-semibold text-purple-600">{stats.totalAchievements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-orange-600">{stats.successRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Learning Progress
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Total Tools</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">{stats.totalTools}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">{stats.completedTools}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Achievements</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-2">{stats.totalAchievements}</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 mt-2">{stats.successRate}%</p>
                </div>
              </div>

              {/* Tool Progress */}
              <div className="space-y-4">
                {progress.map((toolProgress) => (
                  <div key={toolProgress.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{toolProgress.tool_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(toolProgress.status)}`}>
                        {toolProgress.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Step {toolProgress.current_step} of {toolProgress.total_steps}</span>
                      <span>•</span>
                      <span>{toolProgress.completed_steps.length} steps completed</span>
                      <span>•</span>
                      <span>Last activity: {new Date(toolProgress.last_activity).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(toolProgress.completed_steps.length / toolProgress.total_steps) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {progress.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No learning progress yet. Start a tutorial to see your progress here!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      {getAchievementIcon(achievement.achievement_type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.achievement_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {achievements.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements yet. Complete tutorials and execute code to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {codeExecutions.slice(0, 10).map((execution) => (
                  <div key={execution.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {execution.success ? 'Successfully executed' : 'Failed to execute'} {execution.tool_id} code
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(execution.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Code className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                
                {codeExecutions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No code executions yet. Try the playground to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage