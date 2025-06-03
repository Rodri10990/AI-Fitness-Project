import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-3">
      {/* Quick Prompts */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 mb-2">
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Create a workout plan")}
        >
          Create a workout plan
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Check my form for")}
        >
          Check my form for...
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("What exercises target")}
        >
          What exercises target...
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Track my progress")}
        >
          Track my progress
        </button>
      </div>

      <form className="flex items-end" onSubmit={handleSubmit}>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            className="w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-2xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary resize-none text-sm"
            style={{ color: '#1f2937' }}
            placeholder="Ask me anything about fitness..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            type="button" 
            className="absolute bottom-2 right-12 text-neutral-400 dark:text-neutral-500"
            onClick={() => {
              // Voice input functionality would be implemented here
              // For now just a placeholder
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
        </div>
        <Button 
          type="submit" 
          className="ml-2 bg-primary hover:bg-primary/90 text-white rounded-full h-9 w-9 flex items-center justify-center flex-shrink-0 p-0"
          disabled={!message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </Button>
      </form>
    </div>
  );
}
