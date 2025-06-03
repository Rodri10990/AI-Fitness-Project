import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoutineManager } from "@/components/workout/routine-view";

export default function Workouts() {
  return (
    <div className="p-4 pb-20">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Workouts</h1>
      </div>
      
      <Tabs defaultValue="routines">
        <TabsList className="mb-4 w-full overflow-x-auto hide-scrollbar">
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routines">
          <RoutineManager />
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-3">
            <WorkoutHistoryItem 
              title="Day 1 - Push Day"
              date="2 days ago"
              duration={55}
              completed={true}
            />
            <WorkoutHistoryItem 
              title="Day 2 - Pull Day"
              date="yesterday"
              duration={58}
              completed={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutHistoryItem({ title, date, duration, completed }: {
  title: string;
  date: string;
  duration: number;
  completed: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <span className={`material-icons mr-3 ${completed ? 'text-primary' : 'text-neutral-300'}`}>
            {completed ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-neutral-500">{date} • {duration} minutes</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <span className="material-icons text-sm">visibility</span>
        </Button>
      </CardContent>
    </Card>
  );
}