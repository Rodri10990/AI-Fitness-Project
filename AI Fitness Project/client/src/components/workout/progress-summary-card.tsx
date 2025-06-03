import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProgressSummaryCard() {
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden mt-2">
      <CardHeader className="bg-primary-dark text-white p-3">
        <CardTitle className="font-heading font-medium">Your 30-Day Strength Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-neutral-100 p-3 rounded-lg text-center">
            <p className="text-neutral-300 text-sm">Workout Consistency</p>
            <p className="text-2xl font-heading font-bold text-primary">82%</p>
            <p className="text-xs text-neutral-300">14 of 17 planned sessions</p>
          </div>
          <div className="bg-neutral-100 p-3 rounded-lg text-center">
            <p className="text-neutral-300 text-sm">Strength Increase</p>
            <p className="text-2xl font-heading font-bold text-primary">12%</p>
            <p className="text-xs text-neutral-300">Average across exercises</p>
          </div>
        </div>
        
        <h4 className="font-medium mb-2">Top Improved Exercises:</h4>
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bench Press</span>
              <span className="text-primary-dark">+18%</span>
            </div>
            <Progress value={75} className="h-2 bg-neutral-200" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Squats</span>
              <span className="text-primary-dark">+15%</span>
            </div>
            <Progress value={65} className="h-2 bg-neutral-200" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Deadlift</span>
              <span className="text-primary-dark">+10%</span>
            </div>
            <Progress value={55} className="h-2 bg-neutral-200" />
          </div>
        </div>
        
        <Button className="bg-accent text-white py-2 px-4 rounded flex items-center justify-center w-full">
          <span className="material-icons mr-2">analytics</span>
          View Detailed Progress
        </Button>
      </CardContent>
    </Card>
  );
}
