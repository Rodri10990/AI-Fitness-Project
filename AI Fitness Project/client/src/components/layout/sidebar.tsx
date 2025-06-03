import { Link, useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [location] = useLocation();

  // Helper to determine if a link is active
  const isActive = (path: string) => location === path;

  return (
    <aside className={`${isOpen ? 'block' : 'hidden'} md:block bg-white w-64 shadow-md z-5 flex-shrink-0 overflow-y-auto`}>
      <div className="px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-xl text-white font-medium">JS</span>
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="font-heading font-semibold text-lg">Jamie Smith</h2>
          <p className="text-neutral-300 text-sm">Premium Plan</p>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link href="/" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/workouts" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/workouts') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">fitness_center</span>
                Workouts
              </Link>
            </li>
            <li>
              <Link href="/ai-trainer" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/ai-trainer') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">smart_toy</span>
                AI Trainer
              </Link>
            </li>
            <li>
              <Link href="/progress" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/progress') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">trending_up</span>
                Progress
              </Link>
            </li>
            <li>
              <Link href="/nutrition" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/nutrition') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">restaurant</span>
                Nutrition
              </Link>
            </li>
            <li>
              <Link href="/settings" className={`flex items-center py-2 px-4 rounded hover:bg-neutral-100 ${isActive('/settings') ? 'bg-primary-light text-white' : 'text-neutral-300'}`}>
                <span className="material-icons mr-3">settings</span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
