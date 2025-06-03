import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="md:hidden text-white p-0 h-8 w-8" 
            onClick={onMenuClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
          <h1 className="text-lg font-heading font-bold">WorkoutTracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="relative p-0 h-8 w-8 text-white"
            onClick={() => {
              // Simple notification functionality - could be expanded later
              alert("Notifications:\n• Workout reminder in 30 min\n• Weekly progress report ready\n• New exercise suggestions available");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <Badge className="absolute -top-1 -right-1 bg-secondary text-white text-xs h-4 w-4 flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center">
            <span className="text-sm text-white font-medium">JS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
