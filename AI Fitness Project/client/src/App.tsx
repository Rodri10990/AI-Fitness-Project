import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
//import AITrainer from "@/pages/ai-trainer";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Progress from "@/pages/progress";
import Nutrition from "@/pages/nutrition";
import Settings from "@/pages/settings";
import RoutineDetail from "@/pages/routine-detail";
import DayDetail from "@/pages/day-detail";
import Library from "@/pages/Library";
import WorkoutPlayer from "@/pages/WorkoutPlayer";
import TabBar from "@/components/layout/tab-bar";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
// Add this import at the top
import { AITrainer } from './components/AITrainer';

// Add this route in your navigation/tab setup
// The exact implementation depends on your navigation library

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Dashboard} />
      <Route path="/ai-trainer" component={AITrainer} />
      <Route path="/workouts" component={Library} />
      <Route path="/progress" component={Progress} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/settings" component={Settings} />
      <Route path="/routine/:id" component={RoutineDetail} />
      <Route path="/routine/:routineId/day/:dayId" component={DayDetail} />
      <Route path="/library" component={Library} />
      <Route path="/workout/:id" component={WorkoutPlayer} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col h-screen bg-neutral-100">
          <main className="flex-1 flex flex-col overflow-y-auto pb-16">
            <Router />
          </main>
          <TabBar />
          <PWAInstallPrompt />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
