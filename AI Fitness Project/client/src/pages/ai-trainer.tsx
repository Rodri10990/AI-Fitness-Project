import { useEffect, useState, useRef } from "react";
import ChatInterface from "@/components/workout/chat-interface";
import MessageInput from "@/components/workout/message-input";
import WorkoutPlanCard from "@/components/workout/workout-plan-card";
import ExerciseFormCard from "@/components/workout/exercise-form-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageEntry } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRoutineStore } from "@/lib/workoutRoutineStore";
import { useUserStore } from "@/lib/userStore";

interface ConversationResponse {
  id: number;
  messages: MessageEntry[];
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  notes?: string;
}

interface WorkoutPlan {
  name: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

interface ExerciseFormGuide {
  exerciseName: string;
  steps: string[];
  keyPoints: string[];
  commonMistakes: string[];
  beginnerModifications: string[];
}

export default function AITrainer() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [exerciseForm, setExerciseForm] = useState<ExerciseFormGuide | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { addRoutine } = useRoutineStore();
  const { name, weight, bodyFat } = useUserStore();

  // Fetch existing conversation or start a new one
  const { data: conversationData, isLoading } = useQuery<ConversationResponse>({
    queryKey: ["/api/trainer/conversation"],
  });



  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message",
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startVoiceInput = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "🎤 Listening...",
        description: "Speak your question to your AI trainer"
      });
    }
  };

  const saveWorkoutPlan = () => {
    if (workoutPlan) {
      const newRoutine = {
        name: workoutPlan.name,
        description: workoutPlan.description,
        days: [{
          id: 'day1',
          name: 'AI Generated Workout',
          description: workoutPlan.description,
          exercises: workoutPlan.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets || 3,
            reps: ex.reps || 10,
            duration: ex.duration,
            notes: ex.notes || ''
          })),
          duration: workoutPlan.duration
        }],
        favorite: false
      };
      
      addRoutine(newRoutine);
      toast({
        title: "Workout saved! 💪",
        description: "Added to your routine library"
      });
    }
  };
  
  // Generate workout plan mutation
  const generateWorkoutMutation = useMutation({
    mutationFn: async (query: { goals: string, timeConstraint: number, equipment: string[] }) => {
      const response = await apiRequest(
        "POST",
        "/api/trainer/generate-workout",
        query
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data && data.name) {
        setWorkoutPlan(data);
      }
    },
    onError: () => {
      toast({
        title: "Failed to generate workout plan",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Get exercise form guidance mutation
  const getExerciseFormMutation = useMutation({
    mutationFn: async (exerciseName: string) => {
      const response = await apiRequest(
        "GET",
        `/api/trainer/exercise-form/${encodeURIComponent(exerciseName)}`
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data && data.exerciseName) {
        setExerciseForm(data);
      }
    },
    onError: () => {
      toast({
        title: "Failed to get exercise form guidance",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      
      // Removed automatic workout generation - let AI handle routine creation instead
      
      // Check if message is asking about exercise form
      const exerciseFormMatch = message.match(/form\s+for\s+([a-z\s]+)/i);
      if (exerciseFormMatch && exerciseFormMatch[1]) {
        // Get exercise form guidance in parallel
        getExerciseFormMutation.mutate(exerciseFormMatch[1].trim());
      }
      
      // Continue with normal message processing
      const response = await apiRequest(
        "POST",
        "/api/trainer/message",
        {
          message,
          conversationId,
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Handle special data from response (temporarily disabled)
      // if (data.workout) {
      //   setWorkoutPlan(data.workout);
      // }
      if (data.exerciseForm) {
        setExerciseForm(data.exerciseForm);
      }
      // Disabled automatic routine creation
      // if (data.routine) {
      //   addRoutine(data.routine);
      //   toast({
      //     title: "🎉 New Routine Created!",
      //     description: `"${data.routine.name}" has been added to your workouts!`,
      //   });
      // }
      
      queryClient.invalidateQueries({ queryKey: ["/api/trainer/conversation"] });
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (conversationData) {
      setConversationId(conversationData.id);
      setMessages(conversationData.messages || []);
    }
  }, [conversationData]);
  
  // Handle errors
  useEffect(() => {
    const handleError = () => {
      toast({
        title: "Connection error",
        description: "Please check your internet connection",
        variant: "destructive",
      });
    };
    window.addEventListener('offline', handleError);
    return () => window.removeEventListener('offline', handleError);
  }, [toast]);

  // Function to detect content type in user messages
  const messageContainsWorkoutPlan = (msg: string): boolean => {
    return msg.toLowerCase().includes("workout plan") || 
           msg.toLowerCase().includes("workout routine") ||
           msg.toLowerCase().includes("exercise plan");
  };
  
  const messageContainsExerciseForm = (msg: string): boolean => {
    return msg.toLowerCase().includes("form for") || 
           (msg.toLowerCase().includes("how to") && 
            msg.toLowerCase().includes("perform")) ||
           (msg.toLowerCase().includes("exercise") && 
            msg.toLowerCase().includes("technique"));
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Clear special content if message isn't about them
    if (!messageContainsWorkoutPlan(message)) {
      setWorkoutPlan(null);
    }
    
    if (!messageContainsExerciseForm(message)) {
      setExerciseForm(null);
    }
    
    // Add user message immediately to UI
    const userMessage: MessageEntry = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Trainer Info Section */}
      <div className="bg-white dark:bg-neutral-900 p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="mr-3 h-10 w-10 bg-accent rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-lg">smart_toy</span>
          </div>
          <div>
            <h2 className="font-semibold text-base">AI Personal Trainer</h2>
            <p className="text-neutral-400 text-xs">Your fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Interface with Special Cards */}
      <ChatInterface 
        messages={messages} 
        isLoading={isLoading} 
        isTyping={isTyping} 
        onSendMessage={handleSendMessage}
        specialContent={
          <>

            {workoutPlan && (
              <div className="space-y-3">
                <WorkoutPlanCard workoutPlan={workoutPlan} />
                <div className="flex gap-2">
                  <Button 
                    onClick={saveWorkoutPlan}
                    className="flex-1"
                    size="sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save to Routines
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => toast({
                      title: "Workout shared! 🔗",
                      description: "Link copied to clipboard"
                    })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                  </Button>
                </div>
              </div>
            )}
            {exerciseForm && <ExerciseFormCard formGuide={exerciseForm} />}
          </>
        }
      />

      {/* Enhanced Message Input with Voice */}
      <div className="relative">
        <MessageInput onSendMessage={handleSendMessage} />
        {voiceSupported && (
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={`absolute right-16 bottom-3 h-8 w-8 ${
              isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''
            }`}
            onClick={startVoiceInput}
            disabled={isListening}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </Button>
        )}
      </div>

      {/* Personalized Quick Actions */}
      <div className="grid grid-cols-2 gap-2 p-4 bg-neutral-50 dark:bg-neutral-900/50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSendMessage(`Create a workout plan for my ${weight}lb body weight focusing on building muscle`)}
        >
          💪 Custom Workout Plan
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSendMessage("What exercises can help me improve my body composition?")}
        >
          📊 Body Composition Tips
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSendMessage("Show me proper form for compound exercises")}
        >
          🎯 Exercise Form Guide
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSendMessage("Track my progress and suggest improvements")}
        >
          📈 Progress Analysis
        </Button>
      </div>
    </div>
  );
}
