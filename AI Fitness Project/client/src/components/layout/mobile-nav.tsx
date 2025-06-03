import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  // Helper to determine if a link is active
  const isActive = (path: string) => location === path;

  return (
    <nav className="md:hidden bg-white border-t border-neutral-200 py-2">
      <div className="flex justify-around">
        <Link href="/" className={`flex flex-col items-center px-3 ${isActive('/') ? 'text-primary' : 'text-neutral-300'}`}>
            <span className="material-icons">dashboard</span>
            <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link href="/workouts" className={`flex flex-col items-center px-3 ${isActive('/workouts') ? 'text-primary' : 'text-neutral-300'}`}>
            <span className="material-icons">fitness_center</span>
            <span className="text-xs mt-1">Workouts</span>
        </Link>
        <Link href="/ai-trainer" className={`flex flex-col items-center px-3 ${isActive('/ai-trainer') ? 'text-primary' : 'text-neutral-300'}`}>
            <span className="material-icons">smart_toy</span>
            <span className="text-xs mt-1">AI Trainer</span>
        </Link>
        <Link href="/progress" className={`flex flex-col items-center px-3 ${isActive('/progress') ? 'text-primary' : 'text-neutral-300'}`}>
            <span className="material-icons">trending_up</span>
            <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link href="/settings" className={`flex flex-col items-center px-3 ${isActive('/settings') ? 'text-primary' : 'text-neutral-300'}`}>
            <span className="material-icons">settings</span>
            <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
