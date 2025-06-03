// client/src/components/workout/chat-interface.tsx
import React, { useRef, useEffect, ReactNode } from 'react';
import { MessageEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  messages: MessageEntry[];
  isLoading: boolean;
  isTyping: boolean;
  specialContent?: ReactNode;
  onSendMessage?: (message: string) => void;
}

export default function ChatInterface({ 
  messages, 
  isLoading, 
  isTyping, 
  specialContent,
  onSendMessage 
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, specialContent]);

  const handleQuickPrompt = (prompt: string) => {
    if (onSendMessage) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Chat Messages */}
      <div className="flex-1 p-4 pb-5 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-4xl mb-3">💪</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Your AI Trainer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Ask me about workouts, form tips, nutrition, or anything fitness-related!
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm max-w-xs shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {specialContent && (
          <div className="mt-4">
            {specialContent}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

const MessageBubble: React.FC<{ message: MessageEntry }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        isUser 
          ? 'bg-green-500 text-white rounded-br-sm' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div className={`text-xs mt-1 opacity-70 ${
          isUser ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      <span className="text-gray-500 text-sm">AI Trainer is typing...</span>
    </div>
  );
};

const quickPrompts = [
  "Create a workout for me",
  "Check my form", 
  "Nutrition advice",
  "Motivate me!",
  "Rest day activities",
  "Injury prevention"
];