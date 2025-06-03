// client/src/lib/ai-trainer.ts - Enhanced AI conversation helpers
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UserProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  injuries?: string[];
  preferences: {
    workoutDuration: number;
    workoutsPerWeek: number;
    equipment: string[];
  };
}

interface WorkoutContext {
  currentRoutine?: string;
  recentWorkouts: any[];
  progressData: any[];
}

export class AITrainer {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });
  }

  async getPersonalizedAdvice(
    message: string, 
    userProfile: UserProfile, 
    workoutContext: WorkoutContext
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(userProfile, workoutContext);
    
    try {
      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm your personal AI fitness trainer, ready to help you with workouts, form tips, nutrition advice, and motivation. How can I assist you today?" }],
          },
        ],
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error('AI Trainer Error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  private buildSystemPrompt(userProfile: UserProfile, context: WorkoutContext): string {
    return `You are an expert AI fitness trainer. Here's what you know about the user:

PROFILE:
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals.join(', ')}
- Available Equipment: ${userProfile.preferences.equipment.join(', ')}
- Workout Duration Preference: ${userProfile.preferences.workoutDuration} minutes
- Frequency: ${userProfile.preferences.workoutsPerWeek} times per week
${userProfile.injuries ? `- Injuries/Limitations: ${userProfile.injuries.join(', ')}` : ''}

RECENT ACTIVITY:
${context.currentRoutine ? `- Current Routine: ${context.currentRoutine}` : ''}
- Recent Workouts: ${context.recentWorkouts.length} completed this week

INSTRUCTIONS:
- Be encouraging and motivational
- Provide specific, actionable advice
- Consider their fitness level and limitations
- Focus on proper form and safety
- Suggest modifications when needed
- Keep responses concise but helpful
- Use emojis sparingly but effectively

Always prioritize safety and proper form over intensity.`;
  }

  async generateWorkoutPlan(
    userProfile: UserProfile,
    specificRequests?: string
  ): Promise<any> {
    const prompt = `Create a detailed ${userProfile.preferences.workoutDuration}-minute workout plan for a ${userProfile.fitnessLevel} level person.

Goals: ${userProfile.goals.join(', ')}
Available Equipment: ${userProfile.preferences.equipment.join(', ')}
${specificRequests ? `Special Requests: ${specificRequests}` : ''}

Format the response as a structured workout with:
1. Warm-up (5 minutes)
2. Main workout (exercises with sets, reps, rest periods)
3. Cool-down (5 minutes)

Include form tips and modifications for each exercise.`;

    try {
      const result = await this.model.generateContent(prompt);
      return this.parseWorkoutPlan(result.response.text());
    } catch (error) {
      console.error('Workout generation error:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  private parseWorkoutPlan(response: string): any {
    // Parse the AI response into structured workout data
    // This would convert the text response into your app's workout format
    return {
      duration: 45,
      exercises: [
        // Parsed exercises would go here
      ],
      warmup: [
        // Parsed warmup would go here
      ],
      cooldown: [
        // Parsed cooldown would go here
      ]
    };
  }

  async analyzeProgress(progressData: any[]): Promise<string> {
    const prompt = `Analyze this fitness progress data and provide insights:

${JSON.stringify(progressData, null, 2)}

Provide:
1. Key improvements observed
2. Areas that need attention
3. Specific recommendations for next week
4. Motivational feedback`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Progress analysis error:', error);
      return "I'm unable to analyze your progress right now. Keep up the great work!";
    }
  }
}

// client/src/hooks/useAITrainer.ts - React hook for AI trainer
import { useState, useCallback } from 'react';
import { useUserStore } from '../lib/userStore';
import { useWorkoutStore } from '../lib/workoutStore';

export const useAITrainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  
  const userProfile = useUserStore(state => state.profile);
  const workoutContext = useWorkoutStore(state => ({
    currentRoutine: state.currentRoutine,
    recentWorkouts: state.recentWorkouts,
    progressData: state.progressData
  }));

  const trainer = new AITrainer(process.env.REACT_APP_GEMINI_API_KEY!);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await trainer.getPersonalizedAdvice(
        message,
        userProfile,
        workoutContext
      );
      
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: "I'm having trouble right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  }, [userProfile, workoutContext]);

  const generateWorkout = useCallback(async (requests?: string) => {
    setIsLoading(true);
    try {
      const workout = await trainer.generateWorkoutPlan(userProfile, requests);
      return workout;
    } catch (error) {
      console.error('Workout generation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  return {
    messages,
    isLoading,
    sendMessage,
    generateWorkout,
    clearMessages: () => setMessages([])
  };
};