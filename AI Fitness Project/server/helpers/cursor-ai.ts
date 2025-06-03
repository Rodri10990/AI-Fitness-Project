import axios from 'axios';
import { MessageEntry } from "@shared/schema";

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

// Function to get AI response using Cursor's built-in AI
export async function getAIResponse(messages: MessageEntry[]): Promise<MessageEntry> {
  try {
    // Use mock responses instead of making actual API calls
    return getMockResponse(messages[messages.length - 1]);
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return a mock response on error
    return getMockResponse(messages[messages.length - 1]);
  }
}

// Function to generate mock responses for testing
function getMockResponse(lastMessage: MessageEntry): MessageEntry {
  const userMessage = lastMessage.content.toLowerCase();
  let responseContent = "";
  
  // Generate different responses based on user input patterns
  if (userMessage.includes("workout plan") || userMessage.includes("routine") || userMessage.includes("exercise program")) {
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
    const greetings = [
      "Hey there! How's your day going?",
      "Hi! What's up?",
      "Hello! How are you feeling today?",
      "Hey! Ready to chat about fitness or just want to say hi?",
      "Hi there! What's on your mind?"
    ];
    responseContent = greetings[Math.floor(Math.random() * greetings.length)];
  } 
  else {
    // Give more natural, conversational responses based on the input
    if (userMessage.includes("muscle") || userMessage.includes("strength")) {
      responseContent = "Building muscle takes consistency and progressive overload. Are you looking to focus on specific muscle groups or overall strength development?";
    }
    else if (userMessage.includes("cardio") || userMessage.includes("running")) {
      responseContent = "Cardio is great for heart health and endurance! What's your current activity level, and what are your goals?";
    }
    else if (userMessage.includes("weight loss") || userMessage.includes("fat")) {
      responseContent = "Weight management combines exercise with nutrition. A caloric deficit through both diet and exercise usually works best. What's your current approach?";
    }
    else if (userMessage.includes("nutrition") || userMessage.includes("diet")) {
      responseContent = "Nutrition plays a huge role in fitness results! Adequate protein, balanced macros, and proper hydration are key. What aspect of nutrition interests you most?";
    }
    else if (userMessage.includes("time") || userMessage.includes("busy")) {
      responseContent = "I totally understand being busy! Even 15-20 minute workouts can be effective when done consistently. What's your typical schedule like?";
    }
    else {
      const casualResponses = [
        "That's interesting! Tell me more about that.",
        "I'm listening! What else is going on?",
        "Hmm, that's a good point. What made you think about that?",
        "Cool! I'm here if you want to chat about anything.",
        "Right on! What's got you curious about that?",
        "Nice! Feel free to share whatever's on your mind."
      ];
      responseContent = casualResponses[Math.floor(Math.random() * casualResponses.length)];
    }
  }
  
  return {
    role: "assistant",
    content: responseContent,
    timestamp: new Date().toISOString(),
  };
}

export async function generateWorkoutPlan(userGoals: string, timeConstraint: number, equipment?: string[]): Promise<any> {
  try {
    // Normalize user goals
    const goals = userGoals.toLowerCase();
    
    // Extract workout type
    let workoutType = "Full-Body";
    if (goals.includes("strength")) workoutType = "Strength";
    if (goals.includes("cardio")) workoutType = "Cardio";
    if (goals.includes("hiit")) workoutType = "HIIT";
    if (goals.includes("flexibility") || goals.includes("yoga")) workoutType = "Flexibility";
    
    // Extract fitness level
    let fitnessLevel = "intermediate";
    if (goals.includes("beginner")) fitnessLevel = "beginner";
    if (goals.includes("advanced")) fitnessLevel = "advanced";
    
    // Equipment-based exercises database
    const exercisesByEquipment: Record<string, Array<{name: string, type: string}>> = {
      "none": [
        { name: "Push-ups", type: "upper" },
        { name: "Bodyweight Squats", type: "lower" },
        { name: "Lunges", type: "lower" },
        { name: "Plank", type: "core" },
        { name: "Mountain Climbers", type: "cardio" },
        { name: "Jumping Jacks", type: "cardio" },
        { name: "Burpees", type: "full" },
        { name: "Glute Bridges", type: "lower" },
        { name: "Tricep Dips", type: "upper" },
        { name: "Crunches", type: "core" },
        { name: "Side Planks", type: "core" },
        { name: "Superman", type: "back" },
        { name: "Wall Sit", type: "lower" },
        { name: "High Knees", type: "cardio" }
      ],
      "dumbbells": [
        { name: "Dumbbell Squats", type: "lower" },
        { name: "Dumbbell Lunges", type: "lower" },
        { name: "Dumbbell Rows", type: "upper" },
        { name: "Dumbbell Press", type: "upper" },
        { name: "Dumbbell Shoulder Press", type: "upper" },
        { name: "Dumbbell Curls", type: "upper" },
        { name: "Dumbbell Tricep Extensions", type: "upper" },
        { name: "Goblet Squats", type: "lower" },
        { name: "Renegade Rows", type: "upper" },
        { name: "Dumbbell Romanian Deadlifts", type: "lower" }
      ],
      "resistance bands": [
        { name: "Band Squats", type: "lower" },
        { name: "Band Pull-Aparts", type: "upper" },
        { name: "Banded Rows", type: "upper" },
        { name: "Banded Glute Bridges", type: "lower" },
        { name: "Lateral Band Walks", type: "lower" },
        { name: "Banded Shoulder Press", type: "upper" },
        { name: "Banded Bicep Curls", type: "upper" }
      ],
      "kettlebell": [
        { name: "Kettlebell Swings", type: "full" },
        { name: "Kettlebell Goblet Squats", type: "lower" },
        { name: "Kettlebell Rows", type: "upper" },
        { name: "Kettlebell Clean and Press", type: "full" },
        { name: "Turkish Get-ups", type: "full" }
      ],
      "bench": [
        { name: "Bench Press", type: "upper" },
        { name: "Incline Bench Press", type: "upper" },
        { name: "Bench Dips", type: "upper" },
        { name: "Step-ups", type: "lower" },
        { name: "Box Jumps", type: "lower" }
      ],
      "barbell": [
        { name: "Barbell Squats", type: "lower" },
        { name: "Barbell Deadlifts", type: "lower" },
        { name: "Barbell Bench Press", type: "upper" },
        { name: "Barbell Rows", type: "upper" },
        { name: "Barbell Overhead Press", type: "upper" },
        { name: "Barbell Lunges", type: "lower" }
      ],
      "pull-up bar": [
        { name: "Pull-ups", type: "upper" },
        { name: "Chin-ups", type: "upper" },
        { name: "Hanging Leg Raises", type: "core" },
        { name: "Hanging Knee Raises", type: "core" }
      ],
      "yoga mat": [
        { name: "Downward Dog", type: "flexibility" },
        { name: "Warrior Pose", type: "flexibility" },
        { name: "Child's Pose", type: "flexibility" },
        { name: "Cobra Stretch", type: "flexibility" }
      ]
    };
    
    // If no equipment specified, default to bodyweight
    let availableEquipment = equipment || ["none"];
    
    // If they mentioned equipment in the goals, extract it
    const equipmentKeywords = [
      "dumbbell", "kettlebell", "barbell", "bench", 
      "resistance band", "pull-up bar", "yoga mat", "no equipment"
    ];
    
    for (const keyword of equipmentKeywords) {
      if (goals.includes(keyword)) {
        if (keyword === "no equipment") {
          availableEquipment = ["none"];
          break;
        } else if (keyword === "resistance band") {
          availableEquipment.push("resistance bands");
        } else if (keyword === "pull-up bar") {
          availableEquipment.push("pull-up bar");
        } else {
          availableEquipment.push(keyword);
        }
      }
    }
    
    // Remove duplicates
    availableEquipment = Array.from(new Set(availableEquipment));
    
    // Collect exercises based on available equipment
    let availableExercises: Array<{name: string, type: string}> = [];
    for (const equip of availableEquipment) {
      if (exercisesByEquipment[equip]) {
        availableExercises = [...availableExercises, ...exercisesByEquipment[equip]];
      }
    }
    
    // Make sure we always have some exercises by including bodyweight if needed
    if (availableExercises.length < 5) {
      availableExercises = [...availableExercises, ...exercisesByEquipment["none"]];
    }
    
    // Remove duplicates
    availableExercises = availableExercises.filter((exercise, index, self) =>
      index === self.findIndex((e) => e.name === exercise.name)
    );
    
    // Select exercises based on workout type
    let selectedExercises: Array<{name: string, type: string}> = [];
    
    if (workoutType === "Cardio") {
      selectedExercises = availableExercises.filter(ex => ex.type === "cardio" || ex.type === "full");
    } else if (workoutType === "Strength") {
      selectedExercises = availableExercises.filter(ex => 
        ex.type === "upper" || ex.type === "lower" || ex.type === "full"
      );
    } else if (workoutType === "Flexibility") {
      selectedExercises = availableExercises.filter(ex => ex.type === "flexibility");
      if (selectedExercises.length < 4) {
        // Add some core and full body exercises if we don't have enough flexibility ones
        selectedExercises = [
          ...selectedExercises,
          ...availableExercises.filter(ex => ex.type === "core" || ex.type === "full").slice(0, 4 - selectedExercises.length)
        ];
      }
    } else if (workoutType === "HIIT") {
      // For HIIT, prioritize full body and cardio, but include some strength
      selectedExercises = availableExercises.filter(ex => ex.type === "cardio" || ex.type === "full");
      const strengthExercises = availableExercises.filter(ex => 
        ex.type === "upper" || ex.type === "lower" || ex.type === "core"
      );
      selectedExercises = [...selectedExercises, ...strengthExercises.slice(0, 4)];
    } else {
      // For Full-Body, ensure a balanced mix of all types
      const upperExercises = availableExercises.filter(ex => ex.type === "upper").slice(0, 2);
      const lowerExercises = availableExercises.filter(ex => ex.type === "lower").slice(0, 2);
      const coreExercises = availableExercises.filter(ex => ex.type === "core").slice(0, 1);
      const fullExercises = availableExercises.filter(ex => ex.type === "full").slice(0, 1);
      const cardioExercises = availableExercises.filter(ex => ex.type === "cardio").slice(0, 1);
      
      selectedExercises = [
        ...upperExercises,
        ...lowerExercises,
        ...coreExercises,
        ...fullExercises,
        ...cardioExercises
      ];
    }
    
    // Limit number of exercises based on time constraint
    let exerciseCount = Math.min(Math.floor(timeConstraint / 5), 8);
    exerciseCount = Math.max(exerciseCount, 3); // At least 3 exercises
    
    selectedExercises = selectedExercises.slice(0, exerciseCount);
    
    // Randomly shuffle the exercises
    selectedExercises = selectedExercises.sort(() => Math.random() - 0.5);
    
    // Calculate sets and reps based on workout type and fitness level
    const finalExercises = selectedExercises.map(exercise => {
      let sets = 3; // default
      let reps = 12; // default
      let duration = undefined; // for timed exercises
      
      // Adjust based on fitness level
      if (fitnessLevel === "beginner") {
        sets = 2;
        reps = 10;
      } else if (fitnessLevel === "advanced") {
        sets = 4;
        reps = 15;
      }
      
      // Adjust based on exercise type
      if (exercise.type === "cardio") {
        duration = fitnessLevel === "beginner" ? 30 : fitnessLevel === "advanced" ? 60 : 45;
        reps = undefined;
      } else if (exercise.type === "core" || exercise.name.includes("Plank")) {
        duration = fitnessLevel === "beginner" ? 20 : fitnessLevel === "advanced" ? 45 : 30;
        reps = undefined;
      }
      
      return {
        name: exercise.name,
        sets,
        reps,
        duration
      };
    });
    
    // Create the final workout plan
    return {
      name: `${timeConstraint}-Minute ${workoutType} Workout`,
      description: `A ${fitnessLevel} level workout with ${availableEquipment.filter(e => e !== "none").join(", ") || "bodyweight"} exercises`,
      duration: timeConstraint,
      exercises: finalExercises
    };
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan");
  }
}

export async function getExerciseFormGuidance(exerciseName: string): Promise<any> {
  try {
    // Return predefined exercise form guidance based on exercise name
    const exerciseGuides: Record<string, any> = {
      "squat": {
        exerciseName: "Squat",
        steps: [
          "Stand with feet shoulder-width apart, toes slightly pointed outward",
          "Keep your chest up and core engaged",
          "Push your hips back and bend your knees simultaneously",
          "Lower until thighs are parallel to ground (or as low as comfortable with good form)",
          "Push through heels to return to standing"
        ],
        keyPoints: [
          "Keep weight in mid-foot and heels, not toes",
          "Maintain a neutral spine throughout the movement",
          "Knees should track over toes, not caving inward",
          "Brace your core throughout the exercise"
        ],
        commonMistakes: [
          "Letting the knees cave inward",
          "Rounding the lower back",
          "Lifting heels off the ground",
          "Not reaching proper depth"
        ],
        beginnerModifications: [
          "Use a chair or bench to squat to",
          "Reduce weight or use bodyweight only",
          "Decrease range of motion until flexibility improves",
          "Hold onto a stable surface for balance"
        ]
      },
      "pushup": {
        exerciseName: "Push-up",
        steps: [
          "Start in a high plank position with hands slightly wider than shoulder-width",
          "Keep your body in a straight line from head to heels",
          "Lower your chest toward the ground by bending your elbows",
          "Keep elbows at a 45-degree angle to your body",
          "Push back up to the starting position"
        ],
        keyPoints: [
          "Maintain a rigid plank throughout the movement",
          "Keep your core engaged and glutes tight",
          "Don't let your hips sag or pike up",
          "Breathe out as you push up"
        ],
        commonMistakes: [
          "Flaring elbows too wide",
          "Letting the hips sag",
          "Not going deep enough",
          "Holding your breath"
        ],
        beginnerModifications: [
          "Perform on knees instead of toes",
          "Use an elevated surface like a counter or wall",
          "Decrease range of motion",
          "Increase rest between sets"
        ]
      },
      "plank": {
        exerciseName: "Plank",
        steps: [
          "Place forearms on the ground with elbows under shoulders",
          "Extend legs back with toes on the ground",
          "Create a straight line from head to heels",
          "Hold the position while breathing normally",
          "Keep your gaze slightly in front of your hands"
        ],
        keyPoints: [
          "Engage your core by drawing your navel toward your spine",
          "Keep your glutes and quads tight",
          "Maintain neutral alignment in your neck and spine",
          "Distribute weight evenly between forearms and toes"
        ],
        commonMistakes: [
          "Letting the hips sag",
          "Raising the hips too high",
          "Holding your breath",
          "Dropping the head or looking up"
        ],
        beginnerModifications: [
          "Hold the position for shorter periods (10-15 seconds)",
          "Perform on knees instead of toes",
          "Place hands on an elevated surface",
          "Take breaks between shorter holds"
        ]
      }
    };
    
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find the closest match
    let bestMatch = "squat"; // Default to squat if no match found
    for (const key of Object.keys(exerciseGuides)) {
      if (normalizedName.includes(key)) {
        bestMatch = key;
        break;
      }
    }
    
    return exerciseGuides[bestMatch];
  } catch (error) {
    console.error("Error getting exercise form guidance:", error);
    throw new Error("Failed to get exercise form guidance");
  }
}