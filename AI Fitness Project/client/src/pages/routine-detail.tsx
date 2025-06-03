import { useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoutineStore } from "@/lib/workoutRoutineStore";
import { Badge } from "@/components/ui/badge";

export default function RoutineDetail() {
  const [, params] = useRoute("/routine/:id");
  const [, setLocation] = useLocation();
  const { routines, selectedRoutine, setSelectedRoutine, selectedDay, setSelectedDay } = useRoutineStore();
  
  useEffect(() => {
    if (params?.id) {
      setSelectedRoutine(params.id);
    }
    
    return () => {
      // Clean up on unmount
      setSelectedRoutine(null);
    };
  }, [params?.id, setSelectedRoutine]);
  
  if (!selectedRoutine) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-neutral-500 mb-4">Routine not found</p>
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
          onClick={() => setLocation("/workouts")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </Button>
        <h1 className="text-xl font-bold">{selectedRoutine.name}</h1>
      </div>
      
      <p className="text-sm text-neutral-500 mb-4">
        {selectedRoutine.description}
      </p>
      
      <h2 className="text-lg font-semibold mb-3">Workout Days</h2>
      
      <div className="space-y-3 mb-6">
        {selectedRoutine.days.map((day) => (
          <Card 
            key={day.id}
            className="bg-white dark:bg-neutral-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedDay(day.id);
              setLocation(`/routine/${selectedRoutine.id}/day/${day.id}`);
            }}
          >
            <CardHeader className="p-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">{day.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {day.duration} min
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm text-neutral-500 mb-2">{day.description}</p>
              <div className="text-xs text-neutral-400 flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                  <path d="M2 20h20"></path>
                  <path d="M14 12V8"></path>
                </svg>
                {day.exercises.length} exercises
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}