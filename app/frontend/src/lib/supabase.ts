// This file is kept for compatibility but now uses SQLite database
// All functionality has been moved to src/lib/database.ts

export * from './database';

// Legacy exports for compatibility
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  current_step: number;
  total_steps: number;
  completed_steps: string[];
  started_at: string;
  last_activity: string;
  completed_at: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  earned_at: string;
  tool_id: string | null;
}

export interface CodeExecution {
  id: string;
  user_id: string;
  tool_id: string;
  code: string;
  validation_result: any;
  execution_result: any;
  created_at: string;
  success: boolean;
}