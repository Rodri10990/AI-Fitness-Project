import { useState, useEffect, useCallback } from 'react';
import { apiService, MessageEntry, MessageRequest, MessageResponse } from '../services/apiService';

interface AITrainerState {
  messages: MessageEntry[];
  isLoading: boolean;
  isTyping: boolean;
  conversationId?: number;
  error?: string;
}

export const useAITrainer = () => {
  const [state, setState] = useState<AITrainerState>({
    messages: [],
    isLoading: true,
    isTyping: false,
  });

  // Load existing conversation on mount
  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      const messages = await apiService.getConversation();
      setState(prev => ({ 
        ...prev, 
        messages, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load conversation' 
      }));
    }
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: MessageEntry = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      error: undefined,
    }));

    try {
      const request: MessageRequest = {
        message: messageText.trim(),
        conversationId: state.conversationId,
      };

      const response: MessageResponse = await apiService.sendMessage(request);

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response.message],
        conversationId: response.conversationId,
        isTyping: false,
      }));

      // Handle special responses (workouts, exercise form, etc.)
      if (response.workout) {
        return { type: 'workout', data: response.workout };
      }
      
      if (response.exerciseForm) {
        return { type: 'exerciseForm', data: response.exerciseForm };
      }

      return { type: 'message', data: response.message };

    } catch (error) {
      setState(prev => ({
        ...prev,
        isTyping: false,
        error: 'Failed to send message. Please check your connection.',
      }));
      throw error;
    }
  }, [state.conversationId]);

  const generateWorkout = useCallback(async (userGoals: string, timeConstraint: number, preferences?: string) => {
    try {
      setState(prev => ({ ...prev, isTyping: true, error: undefined }));
      
      const workout = await apiService.generateWorkout({
        userGoals,
        timeConstraint,
        preferences,
      });

      // Add AI message about the generated workout
      const aiMessage: MessageEntry = {
        role: 'assistant',
        content: `I've created a personalized ${timeConstraint}-minute workout for you! It includes ${workout.exercises?.length || 0} exercises targeting your goals. Would you like me to save this workout to your library?`,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
      }));

      return workout;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isTyping: false,
        error: 'Failed to generate workout',
      }));
      throw error;
    }
  }, []);

  const getExerciseForm = useCallback(async (exerciseName: string) => {
    try {
      setState(prev => ({ ...prev, isTyping: true }));
      
      const formGuidance = await apiService.getExerciseForm(exerciseName);
      
      const aiMessage: MessageEntry = {
        role: 'assistant',
        content: `Here's proper form guidance for ${exerciseName}:\n\n${formGuidance.guidance}`,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
      }));

      return formGuidance;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isTyping: false,
        error: 'Failed to get exercise guidance',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  const retry = useCallback(() => {
    loadConversation();
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    error: state.error,
    sendMessage,
    generateWorkout,
    getExerciseForm,
    clearError,
    retry,
  };
};