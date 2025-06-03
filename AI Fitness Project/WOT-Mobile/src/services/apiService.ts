import axios from 'axios';

// Configure the base URL - using your server's actual IP address
const API_BASE_URL = 'http://192.168.134.50:5000';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MessageEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface MessageRequest {
  message: string;
  conversationId?: number;
}

export interface MessageResponse {
  message: MessageEntry;
  conversationId: number;
  workout?: any;
  exerciseForm?: any;
  progressData?: any;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  muscleGroups: string[];
  calories: number;
  isAIGenerated: boolean;
  createdAt: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  notes?: string;
}

class ApiService {
  // AI Trainer Chat Methods
  async getConversation(): Promise<MessageEntry[]> {
    try {
      const response = await apiClient.get('/api/trainer/conversation');
      return response.data.messages || [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw new Error('Failed to load conversation');
    }
  }

  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    try {
      const response = await apiClient.post('/api/trainer/message', request);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async generateWorkout(request: {
    userGoals: string;
    timeConstraint: number;
    preferences?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/api/trainer/generate-workout', request);
      return response.data;
    } catch (error) {
      console.error('Error generating workout:', error);
      throw new Error('Failed to generate workout');
    }
  }

  // Workout Management Methods
  async getUserWorkouts(): Promise<Workout[]> {
    try {
      const response = await apiClient.get('/api/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to load workouts');
    }
  }

  async saveWorkout(workoutData: any): Promise<Workout> {
    try {
      const response = await apiClient.post('/api/workouts', workoutData);
      return response.data;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Failed to save workout');
    }
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/workouts/${workoutId}`);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }

  async completeWorkout(workoutId: string, duration: number): Promise<void> {
    try {
      await apiClient.post(`/api/workouts/${workoutId}/complete`, { duration });
    } catch (error) {
      console.error('Error completing workout:', error);
      throw new Error('Failed to complete workout');
    }
  }

  // Exercise Form Guidance
  async getExerciseForm(exerciseName: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/trainer/exercise-form/${exerciseName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise form:', error);
      throw new Error('Failed to get exercise guidance');
    }
  }
}

export const apiService = new ApiService();