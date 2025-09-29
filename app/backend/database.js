const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = new Database(path.join(__dirname, 'devops-lab.db'));
    this.JWT_SECRET = 'your-jwt-secret-key-change-in-production';
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Create users table (PostgreSQL-compatible schema)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create profiles table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_progress table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        current_step INTEGER DEFAULT 0,
        total_steps INTEGER NOT NULL,
        completed_steps TEXT DEFAULT '[]',
        started_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
        completed_at TEXT,
        status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
        UNIQUE(user_id, tool_id)
      )
    `);

    // Create achievements table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_type TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        description TEXT NOT NULL,
        earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        tool_id TEXT,
        UNIQUE(user_id, achievement_type, tool_id)
      )
    `);

    // Create code_executions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS code_executions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id TEXT NOT NULL,
        code TEXT NOT NULL,
        validation_result TEXT,
        execution_result TEXT,
        success BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_tool_id ON user_progress(tool_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);
      CREATE INDEX IF NOT EXISTS idx_code_executions_user_id ON code_executions(user_id);
      CREATE INDEX IF NOT EXISTS idx_code_executions_tool_id ON code_executions(tool_id);
    `);
  }

  // Authentication methods
  async signUp(email, password, fullName) {
    try {
      const existingUser = this.db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return { data: null, error: { message: 'User already exists' } };
      }

      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(password, 10);
      const now = new Date().toISOString();

      // Insert user
      this.db.prepare(`
        INSERT INTO users (id, email, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(userId, email, passwordHash, now, now);

      // Insert profile
      this.db.prepare(`
        INSERT INTO profiles (id, user_id, email, full_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), userId, email, fullName, now, now);

      const token = jwt.sign({ userId, email }, this.JWT_SECRET, { expiresIn: '7d' });

      return {
        data: {
          user: { id: userId, email },
          session: { access_token: token }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: 'Failed to create user' } };
    }
  }

  async signIn(email, password) {
    try {
      const user = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        return { data: null, error: { message: 'Invalid credentials' } };
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { data: null, error: { message: 'Invalid credentials' } };
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, this.JWT_SECRET, { expiresIn: '7d' });

      return {
        data: {
          user: { id: user.id, email: user.email },
          session: { access_token: token }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: 'Failed to sign in' } };
    }
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      return null;
    }
  }

  // Profile methods
  getProfile(userId) {
    return this.db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  }

  updateProfile(userId, updates) {
    try {
      const now = new Date().toISOString();
      const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'user_id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      
      this.db.prepare(`
        UPDATE profiles 
        SET ${setClause}, updated_at = ?
        WHERE user_id = ?
      `).run(...values, now, userId);

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update profile' } };
    }
  }

  // Progress methods
  getUserProgress(userId) {
    const rows = this.db.prepare(`
      SELECT * FROM user_progress 
      WHERE user_id = ? 
      ORDER BY last_activity DESC
    `).all(userId);

    return rows.map(row => ({
      ...row,
      completed_steps: JSON.parse(row.completed_steps)
    }));
  }

  updateProgress(userId, toolId, toolName, stepIndex, totalSteps) {
    try {
      const existing = this.db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND tool_id = ?').get(userId, toolId);
      const now = new Date().toISOString();

      if (existing) {
        const completedSteps = JSON.parse(existing.completed_steps);
        if (!completedSteps.includes(stepIndex.toString())) {
          completedSteps.push(stepIndex.toString());
        }
        const isCompleted = completedSteps.length === totalSteps;

        this.db.prepare(`
          UPDATE user_progress 
          SET current_step = ?, completed_steps = ?, last_activity = ?, 
              completed_at = ?, status = ?
          WHERE user_id = ? AND tool_id = ?
        `).run(
          stepIndex,
          JSON.stringify(completedSteps),
          now,
          isCompleted ? now : null,
          isCompleted ? 'completed' : 'in_progress',
          userId,
          toolId
        );
      } else {
        this.db.prepare(`
          INSERT INTO user_progress 
          (id, user_id, tool_id, tool_name, current_step, total_steps, completed_steps, started_at, last_activity, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          uuidv4(),
          userId,
          toolId,
          toolName,
          stepIndex,
          totalSteps,
          JSON.stringify([stepIndex.toString()]),
          now,
          now,
          'in_progress'
        );
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update progress' } };
    }
  }

  // Achievement methods
  getUserAchievements(userId) {
    return this.db.prepare(`
      SELECT * FROM achievements 
      WHERE user_id = ? 
      ORDER BY earned_at DESC
    `).all(userId);
  }

  awardAchievement(userId, achievementType, achievementName, description, toolId) {
    try {
      const existing = this.db.prepare(`
        SELECT id FROM achievements 
        WHERE user_id = ? AND achievement_type = ? AND tool_id = ?
      `).get(userId, achievementType, toolId || null);

      if (existing) return { error: null };

      this.db.prepare(`
        INSERT INTO achievements (id, user_id, achievement_type, achievement_name, description, tool_id, earned_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        userId,
        achievementType,
        achievementName,
        description,
        toolId || null,
        new Date().toISOString()
      );

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to award achievement' } };
    }
  }

  // Code execution methods
  getUserCodeExecutions(userId, limit = 50) {
    const rows = this.db.prepare(`
      SELECT * FROM code_executions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(userId, limit);

    return rows.map(row => ({
      ...row,
      validation_result: JSON.parse(row.validation_result || '{}'),
      execution_result: JSON.parse(row.execution_result || '{}')
    }));
  }

  recordCodeExecution(userId, toolId, code, validationResult, executionResult, success) {
    try {
      this.db.prepare(`
        INSERT INTO code_executions (id, user_id, tool_id, code, validation_result, execution_result, success, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        userId,
        toolId,
        code,
        JSON.stringify(validationResult),
        JSON.stringify(executionResult),
        success ? 1 : 0,
        new Date().toISOString()
      );

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to record code execution' } };
    }
  }

  // Utility methods
  getOverallStats(userId) {
    const progress = this.getUserProgress(userId);
    const achievements = this.getUserAchievements(userId);
    const codeExecutions = this.getUserCodeExecutions(userId);

    const totalTools = progress.length;
    const completedTools = progress.filter(p => p.status === 'completed').length;
    const inProgressTools = progress.filter(p => p.status === 'in_progress').length;
    const totalAchievements = achievements.length;
    const successfulExecutions = codeExecutions.filter(e => e.success).length;
    const totalExecutions = codeExecutions.length;

    return {
      totalTools,
      completedTools,
      inProgressTools,
      totalAchievements,
      successfulExecutions,
      totalExecutions,
      successRate: totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0
    };
  }
}

module.exports = new DatabaseManager();