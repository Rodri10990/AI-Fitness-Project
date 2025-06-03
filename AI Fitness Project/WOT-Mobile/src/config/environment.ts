// Environment configuration for connecting to your backend
export const config = {
  // Update this to your actual backend URL when running your server
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:5000'  // For development - your local backend
    : 'https://your-production-backend.replit.app', // For production
  
  // API endpoints
  endpoints: {
    conversation: '/api/trainer/conversation',
    sendMessage: '/api/trainer/message',
    generateWorkout: '/api/trainer/generate-workout',
    exerciseForm: '/api/trainer/exercise-form',
    workouts: '/api/workouts',
    completeWorkout: '/api/workouts',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Debug settings
  enableLogging: __DEV__,
};