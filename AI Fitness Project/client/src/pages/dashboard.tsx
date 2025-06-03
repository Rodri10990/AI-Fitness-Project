import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/lib/userStore";
import { Link } from "wouter";

export default function Dashboard() {
  const { name, weight, weightUnit, bodyFat } = useUserStore();
  
  // Extract first name for welcome message
  const firstName = name.split(' ')[0];
  
  return (
    <div className="p-4 pb-6">
      <div className="pt-2 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {firstName}</h1>
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </Button>
        </Link>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Weekly Workouts</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">3/4</div>
              <Progress value={75} className="w-1/2 h-2" />
            </div>
            <p className="text-xs text-neutral-400 mt-1">Next: Leg Day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Strength</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">+12%</div>
              <span className="material-icons text-primary">trending_up</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">7 days</div>
              <span className="material-icons text-accent">local_fire_department</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Best: 14 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">1,845</div>
              <span className="material-icons text-orange-500">restaurant</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Goal: 2,000</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Workout */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Today's Workout</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs px-2"
          onClick={() => window.location.href = "/workouts"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add
        </Button>
      </div>
      
      <Card className="mb-5">
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Upper Body Strength</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => window.location.href = "/routine/1/day/day1"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
          </Button>
        </CardHeader>
        <CardContent className="p-3">
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 12h20"></path>
                <path d="M9 12h6"></path>
              </svg>
              <span className="text-sm">Bench Press - 3×10</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 12h20"></path>
                <path d="M9 12h6"></path>
              </svg>
              <span className="text-sm">Shoulder Press - 3×12</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 12h20"></path>
                <path d="M9 12h6"></path>
              </svg>
              <span className="text-sm">Cable Rows - 3×15</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 12h20"></path>
                <path d="M9 12h6"></path>
              </svg>
              <span className="text-sm">Bicep Curls - 3×12</span>
            </li>
          </ul>
          <div className="text-xs text-neutral-400 mt-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            45 minutes
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Section */}
      <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-sm font-medium text-white">Weight</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{weight} {weightUnit}</div>
              <div className="flex items-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <span className="text-xs ml-1">2.5 {weightUnit}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-3 bg-gradient-to-r from-purple-500 to-purple-600">
            <CardTitle className="text-sm font-medium text-white">Body Fat</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{bodyFat}%</div>
              <div className="flex items-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <span className="text-xs ml-1">1.2%</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-neutral-100">
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Completed Lower Body</p>
                <p className="text-xs text-neutral-400">Yesterday</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </li>
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">New PR: Deadlift</p>
                <p className="text-xs text-neutral-400">2 days ago</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </li>
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Added Workout Plan</p>
                <p className="text-xs text-neutral-400">3 days ago</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}