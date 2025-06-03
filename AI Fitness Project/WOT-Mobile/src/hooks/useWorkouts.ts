import { useState, useEffect, useCallback } from 'react';
import { apiService, Workout } from '../services/apiService';

interface WorkoutsState {
  workouts: Workout[];
  isLoading: boolean;
  error?: string;
  refreshing: boolean;
}

export const useWorkouts = () => {
  const [state, setState] = useState<WorkoutsState>({
    workouts: [],
    isLoading: true,
    error: undefined,
    refreshing: false,
  });

  const loadWorkouts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      const workouts = await apiService.getUserWorkouts();
      setState(prev => ({ 
        ...prev, 
        workouts, 
        isLoading: false, 
        refreshing: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        refreshing: false,
        error: 'Failed to load workouts' 
      }));
    }
  }, []);

  const refreshWorkouts = useCallback(async () => {
    setState(prev => ({ ...prev, refreshing: true }));
    await loadWorkouts();
  }, [loadWorkouts]);

  const deleteWorkout = useCallback(async (workoutId: string) => {
    try {
      await apiService.deleteWorkout(workoutId);
      setState(prev => ({
        ...prev,
        workouts: prev.workouts.filter(w => w.id !== workoutId)
      }));
    } catch (error) {
      throw new Error('Failed to delete workout');
    }
  }, []);

  const saveWorkout = useCallback(async (workoutData: any) => {
    try {
      const savedWorkout = await apiService.saveWorkout(workoutData);
      setState(prev => ({
        ...prev,
        workouts: [savedWorkout, ...prev.workouts]
      }));
      return savedWorkout;
    } catch (error) {
      throw new Error('Failed to save workout');
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  return {
    workouts: state.workouts,
    isLoading: state.isLoading,
    error: state.error,
    refreshing: state.refreshing,
    refreshWorkouts,
    deleteWorkout,
    saveWorkout,
    retry: loadWorkouts,
  };
};