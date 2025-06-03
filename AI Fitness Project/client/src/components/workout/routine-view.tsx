import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRoutineStore, type Routine, type RoutineDay, type Exercise } from "@/lib/workoutRoutineStore";
import { useState } from "react";

export function RoutineOverview() {
  const { routines, setSelectedRoutine, toggleFavorite } = useRoutineStore();
  
  if (routines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-neutral-500 mb-4">No workout routines found</p>
        <Button 
          className="bg-primary"
          onClick={() => window.location.href = "/ai-trainer"}
        >
          Create Routine
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {routines.map((routine) => (
        <Card key={routine.id} className="h-full bg-white dark:bg-neutral-800">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-md font-medium">{routine.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(routine.id);
                    }}
                  >
                    {routine.favorite ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{routine.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-3">
              <Badge variant="outline" className="mr-2 text-xs">
                {routine.days.length} days
              </Badge>
            </div>
            
            <div className="space-y-2 mb-3">
              {routine.days.map((day, index) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:border-primary hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => window.location.href = `/routine/${routine.id}/day/${day.id}`}
                >
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div>
                      <div className="font-medium">{day.name}</div>
                      <div className="text-xs text-neutral-500">{day.exercises.length} exercises • {day.duration} min</div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
              ))}
            </div>
            
            {routine.lastPerformedDay && routine.lastPerformedDate && (
              <div className="text-xs text-neutral-500 mb-3">
                Last workout: {routine.lastPerformedDay} ({routine.lastPerformedDate})
              </div>
            )}
            
            <div className="flex space-x-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs py-1"
                onClick={() => window.location.href = `/routine/${routine.id}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RoutineDaysView() {
  const { selectedRoutine, setSelectedRoutine, setSelectedDay } = useRoutineStore();
  
  if (!selectedRoutine) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => setSelectedRoutine(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Button>
        <h2 className="text-xl font-bold">{selectedRoutine.name}</h2>
      </div>
      
      <p className="text-neutral-500 text-sm mb-4">{selectedRoutine.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedRoutine.days.map((day) => (
          <Card key={day.id} className="h-full bg-white dark:bg-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">{day.name}</CardTitle>
              <p className="text-xs text-neutral-500">{day.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-neutral-500 mb-3">
                <span className="material-icons text-neutral-400 mr-1 text-sm align-text-bottom">schedule</span>
                {day.duration} minutes
              </div>
              
              <p className="text-sm mb-2">{day.exercises.length} exercises</p>
              
              <Button 
                className="w-full bg-primary text-xs py-2 mt-2"
                onClick={() => setSelectedDay(day.id)}
              >
                <span className="material-icons mr-1 text-sm">visibility</span>
                View Workout
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function RoutineDayDetail() {
  const { selectedRoutine, selectedDay, setSelectedDay } = useRoutineStore();
  
  if (!selectedRoutine || !selectedDay) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => setSelectedDay(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Button>
        <div>
          <h2 className="text-xl font-bold">{selectedDay.name}</h2>
          <p className="text-neutral-500 text-sm">{selectedDay.description}</p>
        </div>
      </div>
      
      <Card className="mb-4 bg-white dark:bg-neutral-800">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="text-sm">{selectedDay.duration} minutes</span>
            </div>
            <Button className="bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Start Workout
            </Button>
          </div>
          
          <h3 className="font-medium mb-2">Exercises</h3>
          
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {selectedDay.exercises.map((exercise, index) => (
              <div key={index} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {exercise.sets && (
                        <Badge variant="outline" className="text-xs">
                          {exercise.sets} sets
                        </Badge>
                      )}
                      {exercise.reps && (
                        <Badge variant="outline" className="text-xs">
                          {exercise.reps} reps
                        </Badge>
                      )}
                      {exercise.duration && (
                        <Badge variant="outline" className="text-xs">
                          {exercise.duration} sec
                        </Badge>
                      )}
                      {exercise.rest && (
                        <Badge variant="outline" className="text-xs">
                          {exercise.rest}s rest
                        </Badge>
                      )}
                    </div>
                    {exercise.notes && (
                      <p className="text-xs text-neutral-500 mt-1">{exercise.notes}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <span className="material-icons">help_outline</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RoutineManager() {
  const { selectedRoutine, selectedDay } = useRoutineStore();
  
  // Render based on selection state
  if (selectedDay) {
    return <RoutineDayDetail />;
  }
  
  if (selectedRoutine) {
    return <RoutineDaysView />;
  }
  
  return <RoutineOverview />;
}