import React from 'react';
import { WorkoutGenerator } from '@/components/workout/workout-generator';
import { WorkoutLibrary } from '@/components/workout/workout-library';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestWorkoutGenerator() {
  const testPreferences = {
    workoutType: "strength training",
    duration: 30,
    difficulty: "intermediate",
    equipment: ["dumbbells"]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Workout Generator Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test the auto-save workout generation functionality:
            </p>
            <WorkoutGenerator userId={1} preferences={testPreferences} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📚 Your Workout Library</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutLibrary userId={1} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}