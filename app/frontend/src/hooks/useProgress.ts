import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiClient } from '../lib/api'

interface UserProgress {
  id: string
  user_id: string
  tool_id: string
  tool_name: string
  current_step: number
  total_steps: number
  completed_steps: string[]
  started_at: string
  last_activity: string
  completed_at: string | null
  status: 'not_started' | 'in_progress' | 'completed'
}

interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  description: string
  earned_at: string
  tool_id: string | null
}

interface CodeExecution {
  id: string
  user_id: string
  tool_id: string
  code: string
  validation_result: any
  execution_result: any
  created_at: string
  success: boolean
}

export const useProgress = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [codeExecutions, setCodeExecutions] = useState<CodeExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgress()
      fetchAchievements()
      fetchCodeExecutions()
    } else {
      setProgress([])
      setAchievements([])
      setCodeExecutions([])
      setLoading(false)
    }
  }, [user])

  const fetchProgress = async () => {
    if (!user) return

    try {
      const [progressResult, achievementsResult, statsResult] = await Promise.all([
        apiClient.getProgress(),
        apiClient.getAchievements(),
        apiClient.getStats()
      ])
      
      if (progressResult.data) setProgress(progressResult.data)
      if (achievementsResult.data) setAchievements(achievementsResult.data)
      if (statsResult.data) setStats(statsResult.data)
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const fetchAchievements = () => {
    if (!user) return

    try {
      const data = database.getUserAchievements(user.id)
      setAchievements(data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const fetchCodeExecutions = () => {
    if (!user) return

    try {
      const data = database.getUserCodeExecutions(user.id, 50)
      setCodeExecutions(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching code executions:', error)
      setLoading(false)
    }
  }

  const updateProgress = async (toolId: string, toolName: string, stepIndex: number, totalSteps: number) => {
    if (!user) return

    try {
      await apiClient.updateProgress(toolId, toolName, stepIndex, totalSteps)
      
      // Award achievements
      if (stepIndex === 0) {
        await apiClient.awardAchievement(
          'first_step',
          'First Steps',
          `Started learning ${toolName}`,
          toolId
        )
      }
      
      const completedSteps = stepIndex + 1
      if (completedSteps === totalSteps) {
        await apiClient.awardAchievement(
          'tool_completion',
          'Tool Master',
          `Completed all steps for ${toolName}`,
          toolId
        )
      }

      fetchProgress()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const recordCodeExecution = async (
    toolId: string,
    code: string,
    validationResult: any,
    executionResult: any,
    success: boolean
  ) => {
    if (!user) return

    try {
      await apiClient.recordCodeExecution(toolId, code, validationResult, executionResult, success)
      
      if (success) {
        await apiClient.awardAchievement(
          'code_execution',
          'Code Runner',
          'Successfully executed code in the playground',
          toolId
        )
      }

      fetchCodeExecutions()
    } catch (error) {
      console.error('Error recording code execution:', error)
    }
  }

  const awardAchievement = async (
    achievementType: string,
    achievementName: string,
    description: string,
    toolId?: string
  ) => {
    if (!user) return

    try {
      const result = database.awardAchievement(user.id, achievementType, achievementName, description, toolId)
      
      if (!result.error) {
        fetchAchievements()
      }
    } catch (error) {
      console.error('Error awarding achievement:', error)
    }
  }

  const getToolProgress = (toolId: string) => {
    return progress.find(p => p.tool_id === toolId)
  }

  const getOverallStats = () => {
    if (!user) {
      return {
        totalTools: 0,
        completedTools: 0,
        inProgressTools: 0,
        totalAchievements: 0,
        successfulExecutions: 0,
        totalExecutions: 0,
        successRate: 0
      }
    }

    return database.getOverallStats(user.id)
  }

  return {
    progress,
    achievements,
    codeExecutions,
    loading,
    updateProgress,
    recordCodeExecution,
    awardAchievement,
    getToolProgress,
    getOverallStats,
    refreshProgress: fetchProgress,
    refreshAchievements: fetchAchievements,
    refreshCodeExecutions: fetchCodeExecutions
  }
}