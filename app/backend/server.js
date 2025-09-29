const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { message: 'Access token required' } });
  }

  const user = database.verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: { message: 'Invalid or expired token' } });
  }

  req.user = user;
  next();
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  const result = await database.signUp(email, password, fullName);
  res.json(result);
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  const result = await database.signIn(email, password);
  res.json(result);
});

// Profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  const profile = database.getProfile(req.user.userId);
  res.json({ data: profile, error: null });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const result = database.updateProfile(req.user.userId, req.body);
  res.json(result);
});

// Progress routes
app.get('/api/progress', authenticateToken, (req, res) => {
  const progress = database.getUserProgress(req.user.userId);
  res.json({ data: progress, error: null });
});

app.post('/api/progress', authenticateToken, (req, res) => {
  const { toolId, toolName, stepIndex, totalSteps } = req.body;
  const result = database.updateProgress(req.user.userId, toolId, toolName, stepIndex, totalSteps);
  res.json(result);
});

// Achievement routes
app.get('/api/achievements', authenticateToken, (req, res) => {
  const achievements = database.getUserAchievements(req.user.userId);
  res.json({ data: achievements, error: null });
});

app.post('/api/achievements', authenticateToken, (req, res) => {
  const { achievementType, achievementName, description, toolId } = req.body;
  const result = database.awardAchievement(req.user.userId, achievementType, achievementName, description, toolId);
  res.json(result);
});

// Code execution routes
app.get('/api/code-executions', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const executions = database.getUserCodeExecutions(req.user.userId, limit);
  res.json({ data: executions, error: null });
});

app.post('/api/code-executions', authenticateToken, (req, res) => {
  const { toolId, code, validationResult, executionResult, success } = req.body;
  const result = database.recordCodeExecution(req.user.userId, toolId, code, validationResult, executionResult, success);
  res.json(result);
});

// Stats route
app.get('/api/stats', authenticateToken, (req, res) => {
  const stats = database.getOverallStats(req.user.userId);
  res.json({ data: stats, error: null });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});