import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  notes?: string;
}

interface WorkoutPlan {
  name: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

interface WorkoutPlanCardProps {
  workoutPlan?: WorkoutPlan;
}

export default function WorkoutPlanCard({ workoutPlan }: WorkoutPlanCardProps) {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  
  const defaultPlan: WorkoutPlan = {
    name: "30-Minute Strength Routine",
    description: "Balanced routine for strength training",
    duration: 30,
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: 12 },
      { name: "Push-ups", sets: 3, reps: 15 },
      { name: "Dumbbell Rows", sets: 3, reps: 12 },
      { name: "Lunges", sets: 2, reps: 10 },
      { name: "Plank", sets: 3, duration: 30 }
    ]
  };
  
  // Use provided workout plan or fall back to default
  const plan = workoutPlan || defaultPlan;
  
  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/workouts",
        plan
      );
      return response.json();
    },
    onSuccess: () => {
      setSaved(true);
      toast({
        title: "Workout Saved",
        description: "Your workout has been saved to your profile",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save workout",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });
  
  function formatExercise(exercise: Exercise): string {
    if (exercise.sets && exercise.reps) {
      return `${exercise.sets} sets of ${exercise.reps} reps`;
    } else if (exercise.sets && exercise.duration) {
      return `${exercise.sets} sets of ${exercise.duration} seconds`;
    } else if (exercise.duration) {
      return `${exercise.duration} seconds`;
    } else if (exercise.reps) {
      return `${exercise.reps} reps`;
    } else {
      return exercise.notes || "";
    }
  }

  return (
    <Card className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden mt-2 mb-2">
      <CardHeader className="bg-primary text-white p-3">
        <CardTitle className="font-medium text-sm">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          {plan.description} • {plan.duration} minutes
        </p>
        <ul className="space-y-2">
          {plan.exercises.map((exercise, index) => (
            <li className="flex items-start" key={index}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 mt-0.5">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 12h20"></path>
                <path d="M9 12h6"></path>
              </svg>
              <div>
                <p className="font-medium text-sm">{exercise.name}</p>
                <p className="text-xs text-neutral-400">{formatExercise(exercise)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-3">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary flex items-center text-xs"
            onClick={() => saveWorkoutMutation.mutate()}
            disabled={saved || saveWorkoutMutation.isPending}
          >
            <span className="material-icons text-sm mr-1">
              {saved ? "check" : "save"}
            </span>
            {saved ? "Saved" : "Save Workout"}
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className="text-primary flex items-center text-xs"
          >
            <span className="material-icons text-sm mr-1">edit</span>
            Modify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
