const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }

  // Auth methods
  async signUp(email: string, password: string, fullName: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    });
  }

  async signIn(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(updates: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Progress methods
  async getProgress() {
    return this.request('/progress');
  }

  async updateProgress(toolId: string, toolName: string, stepIndex: number, totalSteps: number) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify({ toolId, toolName, stepIndex, totalSteps })
    });
  }

  // Achievement methods
  async getAchievements() {
    return this.request('/achievements');
  }

  async awardAchievement(achievementType: string, achievementName: string, description: string, toolId?: string) {
    return this.request('/achievements', {
      method: 'POST',
      body: JSON.stringify({ achievementType, achievementName, description, toolId })
    });
  }

  // Code execution methods
  async getCodeExecutions(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/code-executions${query}`);
  }

  async recordCodeExecution(toolId: string, code: string, validationResult: any, executionResult: any, success: boolean) {
    return this.request('/code-executions', {
      method: 'POST',
      body: JSON.stringify({ toolId, code, validationResult, executionResult, success })
    });
  }

  // Stats methods
  async getStats() {
    return this.request('/stats');
  }
}

export const apiClient = new ApiClient();