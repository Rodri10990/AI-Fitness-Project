import OpenAI from "openai";
import { MessageEntry } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || (process.env.OPENAI_API_KEY_ENV_VAR ? process.env[process.env.OPENAI_API_KEY_ENV_VAR] : undefined) || "sk-default_key" 
});

// System message that guides the AI on how to respond
const SYSTEM_MESSAGE: MessageEntry = {
  role: "system",
  content: `You are an AI personal trainer with expertise in exercise science, fitness, and nutrition. You have natural conversations about fitness and only provide detailed workout plans when specifically requested.

  Important guidelines:
  - Have normal conversations about fitness topics
  - Only create detailed workout plans when the user specifically asks for a "workout plan", "routine", or "exercise program"
  - For general fitness questions, give helpful advice without suggesting full workouts
  - Be conversational, supportive, and motivating
  - Answer questions about exercise, nutrition, form, and fitness goals naturally
  - Avoid giving medical advice
  
  When the user asks about:
  - General fitness topics: Give helpful, conversational advice
  - Specific workout requests: Then provide detailed routines with exercises, sets, reps
  - Exercise form: Explain proper technique clearly
  - Motivation/goals: Be encouraging and supportive

  Keep your responses concise but informative.`,
  timestamp: new Date().toISOString(),
};

export async function getAIResponse(messages: MessageEntry[]): Promise<MessageEntry> {
  try {
    // Check if we should use the API or fallback to mock responses
    const useApiKey = process.env.OPENAI_API_KEY && 
                     !process.env.OPENAI_API_KEY.includes("default_key") && 
                     process.env.USE_MOCK_RESPONSES !== "true";
    
    if (useApiKey) {
      // Prepare conversation with system message and user messages
      const conversationMessages = [
        { role: SYSTEM_MESSAGE.role, content: SYSTEM_MESSAGE.content },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: conversationMessages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      // Get the assistant's response
      const assistantResponse = response.choices[0].message.content || "I'm sorry, I couldn't generate a response at this time.";

      // Return formatted message
      return {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Use mock responses when API key is not valid or mock mode is enabled
      return getMockResponse(messages[messages.length - 1]);
    }
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return a mock response on error
    return getMockResponse(messages[messages.length - 1]);
  }
}

// Function to generate mock responses for testing without API
function getMockResponse(lastMessage: MessageEntry): MessageEntry {
  const userMessage = lastMessage.content.toLowerCase();
  let responseContent = "";
  
  // Generate different responses based on user input patterns
  if (userMessage.includes("workout plan") || userMessage.includes("routine")) {
    responseContent = "Here's a 30-minute strength workout plan perfect for busy individuals:\n\n" +
      "1. Warm-up (5 minutes): Light cardio and dynamic stretches\n" +
      "2. Main Circuit (20 minutes, 3 rounds):\n" +
      "   - Goblet Squats: 12 reps\n" +
      "   - Push-ups: 10-15 reps (modify as needed)\n" +
      "   - Dumbbell Rows: 12 reps per arm\n" +
      "   - Lunges: 10 reps per leg\n" +
      "   - Plank: 30 seconds\n" +
      "3. Cool-down (5 minutes): Static stretching\n\n" +
      "This balanced routine works all major muscle groups and can be done 3 times per week.";
  } 
  else if (userMessage.includes("form") && (userMessage.includes("squat") || userMessage.includes("deadlift") || userMessage.includes("bench") || userMessage.includes("exercise"))) {
    responseContent = "Proper form is crucial for both effectiveness and injury prevention. Here's a breakdown for a basic squat:\n\n" +
      "Key Form Points:\n" +
      "1. Start with feet shoulder-width apart, toes slightly pointed outward\n" +
      "2. Keep your chest up and core engaged\n" +
      "3. Push your hips back and bend your knees simultaneously\n" +
      "4. Lower until thighs are parallel to ground (or as low as comfortable with good form)\n" +
      "5. Keep weight in mid-foot and heels, not toes\n" +
      "6. Ensure knees track over toes (don't cave inward)\n" +
      "7. Push through heels to return to standing\n\n" +
      "Common mistakes include rounding the back, letting knees cave inward, or rising onto toes.";
  } 
  else if (userMessage.includes("progress") || userMessage.includes("tracking")) {
    responseContent = "Tracking your progress is essential for long-term success. Based on your recent workouts, here's a summary of your strength gains:\n\n" +
      "- Overall strength increase: 12% in the last 30 days\n" +
      "- Squat: Improved from 135 lbs to 155 lbs (+15%)\n" +
      "- Bench Press: Improved from 110 lbs to 130 lbs (+18%)\n" +
      "- Deadlift: Improved from 160 lbs to 175 lbs (+9%)\n\n" +
      "Your consistency has been excellent at 82% (14 out of 17 planned sessions completed). Keep up the great work!";
  } 
  else if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("hey")) {
    responseContent = "Hello! I'm your AI workout assistant. I can help you create personalized workout plans, provide exercise form guidance, and track your progress. What would you like help with today?";
  } 
  else {
    responseContent = "I'm here to help with your fitness journey. I can create personalized workout plans, provide form guidance for exercises, or help track your progress. What specific fitness topic would you like to explore?";
  }
  
  return {
    role: "assistant",
    content: responseContent,
    timestamp: new Date().toISOString(),
  };
}

export async function generateWorkoutPlan(userGoals: string, timeConstraint: number): Promise<any> {
  try {
    const prompt = `Create a workout plan with the following parameters:
    - User goals: ${userGoals}
    - Time constraint: ${timeConstraint} minutes
    
    Return the response as a JSON object with the following structure:
    {
      "name": "Workout name",
      "description": "Brief description",
      "duration": duration in minutes,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number of sets,
          "reps": number of reps,
          "duration": duration in seconds (if applicable),
          "notes": "Any specific instructions"
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE.content },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan");
  }
}

export async function getExerciseFormGuidance(exerciseName: string): Promise<any> {
  try {
    const prompt = `Provide detailed form guidance for ${exerciseName}. Include:
    1. Step-by-step instructions
    2. Common form mistakes to avoid
    3. Key points to focus on for proper form
    4. Modifications for beginners
    
    Return the response as a JSON object with the following structure:
    {
      "exerciseName": "Name of exercise",
      "steps": ["Step 1", "Step 2", "Step 3"...],
      "keyPoints": ["Key point 1", "Key point 2"...],
      "commonMistakes": ["Mistake 1", "Mistake 2"...],
      "beginnerModifications": ["Modification 1", "Modification 2"...]
    }`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE.content },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error getting exercise form guidance:", error);
    throw new Error("Failed to get exercise form guidance");
  }
}
