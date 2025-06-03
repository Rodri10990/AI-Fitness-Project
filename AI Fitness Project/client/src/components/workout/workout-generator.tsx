// Updated React component to handle auto-saved workouts
// File: client/src/components/workout/workout-generator.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

interface WorkoutGeneratorProps {
  userId?: number;
  preferences?: {
    workoutType?: string;
    duration?: number;
    difficulty?: string;
    equipment?: string[];
  };
}

interface GeneratedWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  exercises: any[];
  estimatedCalories?: number;
  tags?: string[];
}

export function WorkoutGenerator({ userId = 1, preferences }: WorkoutGeneratorProps) {
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const generateWorkoutMutation = useMutation({
    mutationFn: async (workoutParams: any) => {
      const response = await apiRequest(
        "POST",
        "/api/generate-workout",
        workoutParams
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedWorkout(data.workout);
        
        // Show success notification
        toast({
          title: "🎉 Workout Generated!",
          description: "Your workout has been automatically saved to your library.",
          duration: 4000,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate workout. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Error generating workout:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateWorkout = () => {
    const workoutParams = {
      userId,
      preferences: preferences?.workoutType || "general fitness",
      duration: preferences?.duration || 30,
      difficulty: preferences?.difficulty || "intermediate",
      equipment: preferences?.equipment || ["none"]
    };

    generateWorkoutMutation.mutate(workoutParams);
  };

  const handleViewLibrary = () => {
    setLocation('/workouts');
  };

  const handleStartWorkout = () => {
    if (generatedWorkout) {
      // Navigate to workout detail or start workout
      setLocation(`/workouts/${generatedWorkout.id}`);
    }
  };

  const handleGenerateAnother = () => {
    setGeneratedWorkout(null);
    handleGenerateWorkout();
  };

  if (generateWorkoutMutation.isPending) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <div className="text-center">
            <p className="text-lg font-medium">🤖 AI Agent is working...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Creating your personalized workout
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generatedWorkout) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl text-green-600">Workout Ready!</CardTitle>
          <CardDescription>
            "{generatedWorkout.name}" has been added to your library
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <div className="font-medium">⏱️ Duration</div>
              <div className="text-gray-600 dark:text-gray-400">{generatedWorkout.duration} min</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <div className="font-medium">💪 Level</div>
              <div className="text-gray-600 dark:text-gray-400 capitalize">{generatedWorkout.difficulty}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <div className="font-medium">🔥 Calories</div>
              <div className="text-gray-600 dark:text-gray-400">{generatedWorkout.estimatedCalories || 'Est'}</div>
            </div>
          </div>

          {generatedWorkout.tags && generatedWorkout.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {generatedWorkout.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={handleStartWorkout}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Start Workout
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleGenerateAnother}
                variant="outline"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Generate Another
              </Button>
              <Button 
                onClick={handleViewLibrary}
                variant="outline"
                size="sm"
              >
                View Library
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-green-500" />
          AI Workout Generator
        </CardTitle>
        <CardDescription>
          Your AI agent will create and save a personalized routine
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {preferences && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <h4 className="font-medium text-sm">Your Preferences:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {preferences.workoutType && (
                <div>Type: <span className="font-medium">{preferences.workoutType}</span></div>
              )}
              {preferences.duration && (
                <div>Duration: <span className="font-medium">{preferences.duration}min</span></div>
              )}
              {preferences.difficulty && (
                <div>Level: <span className="font-medium capitalize">{preferences.difficulty}</span></div>
              )}
              {preferences.equipment && preferences.equipment.length > 0 && (
                <div className="col-span-2">
                  Equipment: <span className="font-medium">{preferences.equipment.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleGenerateWorkout}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Workout
        </Button>
      </CardContent>
    </Card>
  );
}