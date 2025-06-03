import { Link, useRoute } from "wouter";
import { useEffect, useRef, useState } from "react";

export default function TabBar() {
  const tabRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  
  const isActive = (path: string) => {
    const [match] = useRoute(path);
    return match;
  };
  
  // Check if the tabs need to be scrollable
  useEffect(() => {
    const checkOverflow = () => {
      if (tabRef.current) {
        const isOverflowing = tabRef.current.scrollWidth > tabRef.current.clientWidth;
        setScrollable(isOverflowing);
      }
    };
    
    // Check on mount and on resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);
  
  // Scroll to active tab
  useEffect(() => {
    if (tabRef.current) {
      const activeTab = tabRef.current.querySelector('.text-primary');
      if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabRef.current.getBoundingClientRect();
        
        // If active tab is not fully visible
        if (tabRect.right > containerRect.right || tabRect.left < containerRect.left) {
          // Scroll to center the active tab
          tabRef.current.scrollLeft = 
            activeTab.parentElement!.offsetLeft - 
            (tabRef.current.clientWidth / 2) + 
            (activeTab.parentElement!.clientWidth / 2);
        }
      }
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50">
      <div 
        ref={tabRef} 
        className={`flex items-center h-16 ${
          scrollable ? 'overflow-x-auto overscroll-x-contain' : 'justify-around'
        }`}
      >
        <Link
          href="/"
          className={`flex flex-col items-center justify-center min-w-[25%] h-full ${
            isActive("/") ? "text-primary" : "text-neutral-500"
          }`}
        >
          {/* Home icon */}
          <div className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          href="/workouts"
          className={`flex flex-col items-center justify-center min-w-[25%] h-full ${
            isActive("/workouts") ? "text-primary" : "text-neutral-500"
          }`}
        >
          {/* Fitness icon */}
          <div className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14"></path>
              <path d="M18 5v14"></path>
              <path d="M2 12h20"></path>
              <path d="M9 12h6"></path>
            </svg>
          </div>
          <span className="text-xs mt-1">Workouts</span>
        </Link>
        
        <Link
          href="/ai-trainer"
          className={`flex flex-col items-center justify-center min-w-[25%] h-full ${
            isActive("/ai-trainer") ? "text-primary" : "text-neutral-500"
          }`}
        >
          {/* AI icon */}
          <div className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
          </div>
          <span className="text-xs mt-1">AI Trainer</span>
        </Link>
        
        <Link
          href="/nutrition"
          className={`flex flex-col items-center justify-center min-w-[25%] h-full ${
            isActive("/nutrition") ? "text-primary" : "text-neutral-500"
          }`}
        >
          {/* Nutrition icon */}
          <div className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <span className="text-xs mt-1">Nutrition</span>
        </Link>
        

      </div>
    </div>
  );
}