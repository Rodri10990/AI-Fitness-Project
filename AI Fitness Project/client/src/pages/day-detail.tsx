import { useEffect, useState } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRoutineStore } from "@/lib/workoutRoutineStore";

interface ExerciseProgress {
  [exerciseIndex: number]: {
    [setIndex: number]: {
      reps: number;
      weight: number;
    };
  };
}

interface RestTimer {
  exerciseIndex: number;
  setIndex: number;
  timeRemaining: number;
  isActive: boolean;
}

export default function DayDetail() {
  const [, params] = useRoute("/routine/:routineId/day/:dayId");
  const [, setLocation] = useLocation();
  const { routines, selectedRoutine, setSelectedRoutine, selectedDay, setSelectedDay } = useRoutineStore();
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({});
  const [restTimer, setRestTimer] = useState<RestTimer | null>(null);

  const updateProgress = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        [setIndex]: {
          ...prev[exerciseIndex]?.[setIndex],
          [field]: value
        }
      }
    }));
  };

  const startRestTimer = (exerciseIndex: number, setIndex: number, restTime: number) => {
    setRestTimer({
      exerciseIndex,
      setIndex,
      timeRemaining: restTime,
      isActive: true
    });
  };

  const stopRestTimer = () => {
    setRestTimer(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseImage = (exerciseName: string) => {
    // Placeholder for exercise demonstration images/videos
    const exerciseImages = {
      'Bench Press': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Bench+Press+Demo',
      'Push-ups': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Push-ups+Demo',
      'Overhead Press': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Overhead+Press+Demo',
      'Tricep Dips': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Tricep+Dips+Demo',
      'Lateral Raises': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Lateral+Raises+Demo',
      'Pull-ups': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Pull-ups+Demo',
      'Bent-over Rows': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Bent-over+Rows+Demo',
      'Bicep Curls': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Bicep+Curls+Demo',
      'Lat Pulldowns': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Lat+Pulldowns+Demo',
      'Cable Rows': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Cable+Rows+Demo',
      'Squats': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Squats+Demo',
      'Deadlifts': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Deadlifts+Demo',
      'Leg Press': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Leg+Press+Demo',
      'Leg Curls': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Leg+Curls+Demo',
      'Calf Raises': 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Calf+Raises+Demo'
    };
    return exerciseImages[exerciseName as keyof typeof exerciseImages] || 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Exercise+Demo';
  };
  
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (restTimer && restTimer.isActive && restTimer.timeRemaining > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (!prev || prev.timeRemaining <= 1) {
            // Timer finished
            alert("🔔 Rest time complete! Ready for your next set!");
            return null;
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer]);
  
  useEffect(() => {
    if (params?.routineId) {
      setSelectedRoutine(params.routineId);
      if (params?.dayId) {
        setSelectedDay(params.dayId);
      }
    }
    
    return () => {
      // Clean up on unmount
      setSelectedRoutine(null);
      setSelectedDay(null);
    };
  }, [params?.routineId, params?.dayId, setSelectedRoutine, setSelectedDay]);
  
  if (!selectedRoutine || !selectedDay) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-neutral-500 mb-4">Workout day not found</p>
        <Button onClick={() => setLocation("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 -ml-3" 
          onClick={() => setLocation(`/routine/${selectedRoutine.id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </Button>
        <h1 className="text-xl font-bold">{selectedDay.name}</h1>
      </div>
      
      <p className="text-sm text-neutral-500 mb-4">
        {selectedDay.description}
      </p>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-neutral-500">{selectedDay.duration} minutes</span>
        </div>
        
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          size="sm"
          onClick={() => {
            // Start the workout session
            const startTime = new Date().toLocaleTimeString();
            alert(`🏋️ Workout Started at ${startTime}!\n\nYour ${selectedDay.name} workout is now active.\nEstimated duration: ${selectedDay.duration} minutes\n\nGood luck and stay focused!`);
          }}
        >
          Start Workout
        </Button>
      </div>
      
      <h2 className="text-lg font-semibold mb-3">Exercises</h2>
      
      <div className="space-y-6">
        {selectedDay.exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} className="bg-white dark:bg-neutral-800">
            <CardContent className="p-4">
              {/* Exercise Name */}
              <h3 className="text-xl font-bold mb-3">{exercise.name}</h3>
              
              {/* Exercise Demo Image/Video */}
              <div className="mb-4">
                <img 
                  src={getExerciseImage(exercise.name)} 
                  alt={`${exercise.name} demonstration`}
                  className="w-full h-48 object-cover rounded-lg border border-neutral-200"
                />
              </div>
              
              {/* Exercise Parameters */}
              <div className="flex flex-wrap gap-3 mb-4 p-3 bg-neutral-50 rounded-lg">
                {exercise.sets && exercise.reps && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
                      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                      <path d="M2 20h20"></path>
                      <path d="M14 12V8"></path>
                    </svg>
                    <span className="font-medium text-sm">{exercise.sets} sets × {exercise.reps} reps</span>
                  </div>
                )}
                
                {exercise.rest && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-sm text-neutral-600">Rest: {exercise.rest}s</span>
                  </div>
                )}
              </div>

              {/* Exercise Notes */}
              {exercise.notes && (
                <div className="mb-4 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-blue-800 italic">💡 {exercise.notes}</p>
                </div>
              )}
              
              {/* Progress Tracking Table */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Track Your Progress</h4>
                <div className="w-full">
                  <table className="w-full border border-neutral-200 rounded-lg text-xs">
                    <thead className="bg-neutral-100">
                      <tr>
                        <th className="px-1 py-2 text-left text-xs font-medium w-12">Set</th>
                        <th className="px-1 py-2 text-center text-xs font-medium w-12">Target</th>
                        <th className="px-1 py-2 text-center text-xs font-medium w-16">Reps</th>
                        <th className="px-1 py-2 text-center text-xs font-medium w-16">Kg</th>
                        <th className="px-1 py-2 text-center text-xs font-medium">Timer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: exercise.sets || 1 }, (_, setIndex) => (
                        <tr key={setIndex} className="border-t border-neutral-200">
                          <td className="px-1 py-2 font-medium text-xs">{setIndex + 1}</td>
                          <td className="px-1 py-2 text-center text-xs">{exercise.reps}</td>
                          <td className="px-1 py-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              className="w-12 h-7 text-center mx-auto text-xs"
                              value={exerciseProgress[exerciseIndex]?.[setIndex]?.reps || ''}
                              onChange={(e) => updateProgress(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-1 py-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              step="0.5"
                              className="w-14 h-7 text-center mx-auto text-xs"
                              value={exerciseProgress[exerciseIndex]?.[setIndex]?.weight || ''}
                              onChange={(e) => updateProgress(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-1 py-2">
                            {restTimer && 
                             restTimer.exerciseIndex === exerciseIndex && 
                             restTimer.setIndex === setIndex ? (
                              <div className="flex flex-col items-center">
                                <div className="text-sm font-bold text-primary mb-1">
                                  {formatTime(restTimer.timeRemaining)}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-5 text-xs px-2"
                                  onClick={stopRestTimer}
                                >
                                  Stop
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-green-600 hover:bg-green-700 px-2"
                                onClick={() => startRestTimer(exerciseIndex, setIndex, exercise.rest || 60)}
                                disabled={!exerciseProgress[exerciseIndex]?.[setIndex]?.reps}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                Rest
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}