// client/src/pages/WorkoutPlayer.tsx - New workout player page

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle,
  Clock,
  Flame,
  AlertCircle
} from 'lucide-react';

interface Exercise {
  name: string;
  duration?: string;
  sets?: number;
  reps?: string;
  rest?: string;
  instructions: string;
}

interface Workout {
  id: number;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  estimatedCalories: number;
  metadata: {
    exercises: {
      warmup: Exercise[];
      main: Exercise[];
      cooldown: Exercise[];
    };
  };
}

export default function WorkoutPlayer() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Exercise tracking
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'main' | 'cooldown'>('warmup');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workouts/${id}`);
      
      if (!response.ok) {
        throw new Error('Workout not found');
      }
      
      const data = await response.json();
      setWorkout(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentExercises = () => {
    if (!workout) return [];
    return workout.metadata.exercises[currentPhase] || [];
  };

  const getCurrentExercise = () => {
    const exercises = getCurrentExercises();
    return exercises[currentExerciseIndex] || null;
  };

  const getTotalExercises = () => {
    if (!workout) return 0;
    return (
      workout.metadata.exercises.warmup.length +
      workout.metadata.exercises.main.length +
      workout.metadata.exercises.cooldown.length
    );
  };

  const getCompletedCount = () => {
    return completedExercises.size;
  };

  const getProgress = () => {
    const total = getTotalExercises();
    return total > 0 ? (getCompletedCount() / total) * 100 : 0;
  };

  const markCurrentComplete = () => {
    const exercise = getCurrentExercise();
    if (exercise) {
      setCompletedExercises(prev => new Set([...prev, `${currentPhase}-${currentExerciseIndex}`]));
    }
  };

  const goToNextExercise = () => {
    markCurrentComplete();
    const exercises = getCurrentExercises();
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Move to next phase
      if (currentPhase === 'warmup') {
        setCurrentPhase('main');
        setCurrentExerciseIndex(0);
      } else if (currentPhase === 'main') {
        setCurrentPhase('cooldown');
        setCurrentExerciseIndex(0);
      } else {
        // Workout complete
        completeWorkout();
      }
    }
    
    setExerciseTimer(0);
  };

  const completeWorkout = async () => {
    setIsPlaying(false);
    
    // Update workout completion stats
    try {
      await fetch(`/api/workouts/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Show completion message
      alert(`🎉 Congratulations! You've completed "${workout?.name}"!\n\nEstimated calories burned: ${workout?.estimatedCalories} cal`);
      
      // Navigate back to library
      navigate('/workouts');
    } catch (err) {
      console.error('Error updating workout stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Workout not found</h2>
        <p className="text-gray-500 mb-4">{error || 'This workout could not be loaded.'}</p>
        <Button onClick={() => navigate('/workouts')}>
          Back to Library
        </Button>
      </div>
    );
  }

  const currentExercise = getCurrentExercise();
  const phaseColors = {
    warmup: 'bg-yellow-500',
    main: 'bg-blue-500',
    cooldown: 'bg-green-500'
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/workouts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">{workout.name}</h1>
          <Badge className={phaseColors[currentPhase]}>
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{getCompletedCount()} / {getTotalExercises()} exercises</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      </div>

      {/* Current Exercise */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentExercise ? (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-2xl">{currentExercise.name}</CardTitle>
              <div className="flex gap-4 text-sm text-gray-600">
                {currentExercise.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentExercise.duration}
                  </span>
                )}
                {currentExercise.sets && (
                  <span>{currentExercise.sets} sets</span>
                )}
                {currentExercise.reps && (
                  <span>{currentExercise.reps} reps</span>
                )}
                {currentExercise.rest && (
                  <span>Rest: {currentExercise.rest}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">{currentExercise.instructions}</p>
              
              {/* Exercise timer (simplified) */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{exerciseTimer}s</div>
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-32"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
            <p className="text-gray-600">Great job finishing your workout!</p>
          </Card>
        )}

        {/* Exercise list */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mb-2">
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Exercises
          </h3>
          {getCurrentExercises().map((exercise, index) => {
            const isComplete = completedExercises.has(`${currentPhase}-${index}`);
            const isCurrent = index === currentExerciseIndex;
            
            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg ${
                  isCurrent ? 'bg-primary/10 border-2 border-primary' : 
                  isComplete ? 'bg-green-50' : 'bg-gray-100'
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium ${isComplete ? 'line-through text-gray-500' : ''}`}>
                    {exercise.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {exercise.sets && `${exercise.sets} sets`}
                    {exercise.reps && ` × ${exercise.reps}`}
                    {exercise.duration && exercise.duration}
                  </p>
                </div>
                {isComplete && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => markCurrentComplete()}
            disabled={!currentExercise}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete
          </Button>
          <Button
            className="flex-1"
            onClick={goToNextExercise}
            disabled={!currentExercise}
          >
            Next Exercise
            <SkipForward className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}