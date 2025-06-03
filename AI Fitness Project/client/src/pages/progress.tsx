import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function Progress() {
  // Sample data for charts
  const strengthData = [
    { name: 'Jan', Squat: 135, Bench: 115, Deadlift: 185 },
    { name: 'Feb', Squat: 145, Bench: 125, Deadlift: 205 },
    { name: 'Mar', Squat: 155, Bench: 135, Deadlift: 225 },
    { name: 'Apr', Squat: 165, Bench: 145, Deadlift: 245 },
    { name: 'May', Squat: 175, Bench: 155, Deadlift: 265 },
  ];

  const bodyCompData = [
    { name: 'Jan', Weight: 180, BodyFat: 18 },
    { name: 'Feb', Weight: 178, BodyFat: 17 },
    { name: 'Mar', Weight: 176, BodyFat: 16 },
    { name: 'Apr', Weight: 174, BodyFat: 15 },
    { name: 'May', Weight: 172, BodyFat: 14 },
  ];

  const workoutData = [
    { name: 'Week 1', Workouts: 3, Minutes: 120 },
    { name: 'Week 2', Workouts: 4, Minutes: 180 },
    { name: 'Week 3', Workouts: 3, Minutes: 150 },
    { name: 'Week 4', Workouts: 5, Minutes: 210 },
    { name: 'Week 5', Workouts: 4, Minutes: 190 },
  ];

  const personalRecords = [
    { exercise: "Bench Press", weight: "165 lbs", date: "May 10, 2025" },
    { exercise: "Squat", weight: "225 lbs", date: "May 15, 2025" },
    { exercise: "Deadlift", weight: "275 lbs", date: "May 5, 2025" },
    { exercise: "Shoulder Press", weight: "95 lbs", date: "May 12, 2025" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Progress Tracking</h1>
      
      <Tabs defaultValue="strength">
        <TabsList className="mb-4">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="body-comp">Body Composition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="records">Personal Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="strength">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Strength Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Squat" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Bench" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Deadlift" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard title="Squat" value="175 lbs" change="+10 lbs" timeframe="Last 30 days" />
            <ProgressCard title="Bench Press" value="155 lbs" change="+10 lbs" timeframe="Last 30 days" />
            <ProgressCard title="Deadlift" value="265 lbs" change="+20 lbs" timeframe="Last 30 days" />
          </div>
        </TabsContent>
        
        <TabsContent value="body-comp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bodyCompData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="Weight" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Body Fat Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bodyCompData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="BodyFat" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <ProgressCard title="Current Weight" value="172 lbs" change="-8 lbs" timeframe="Last 5 months" />
            <ProgressCard title="Body Fat %" value="14%" change="-4%" timeframe="Last 5 months" />
          </div>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Workout Consistency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Workouts" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="Minutes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard title="Weekly Average" value="3.8 workouts" change="+0.5" timeframe="Compared to last month" />
            <ProgressCard title="Monthly Total" value="16 workouts" change="+2" timeframe="Compared to last month" />
            <ProgressCard title="Avg. Duration" value="45 minutes" change="+5 min" timeframe="Compared to last month" />
          </div>
        </TabsContent>
        
        <TabsContent value="records">
          <div className="space-y-4">
            {personalRecords.map((record, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-3">
                      <circle cx="12" cy="8" r="6"></circle>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                    <div>
                      <h3 className="font-medium">{record.exercise}</h3>
                      <p className="text-xs text-neutral-300">Achieved on {record.date}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">{record.weight}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProgressCard({ title, value, change, timeframe }: { 
  title: string; 
  value: string; 
  change: string;
  timeframe: string;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-1">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-1">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
          )}
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
          <span className="text-xs text-neutral-300 ml-2">{timeframe}</span>
        </div>
      </CardContent>
    </Card>
  );
}