import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { geminiHelper } from "./helpers/gemini";
import { db } from "./db";
import { workouts } from "@shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // AI Trainer Chat Endpoint
  app.post("/api/trainer/message", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      // Check if user is asking for a workout
      const isWorkoutRequest = message.toLowerCase().match(
        /create|generate|make|design|give me|build|suggest.*workout|routine|exercise|training/
      );
      
      if (isWorkoutRequest) {
        // Extract parameters from the message
        const duration = extractDuration(message) || 30;
        const difficulty = extractDifficulty(message) || 'intermediate';
        const preferences = extractPreferences(message);
        
        // Generate workout using the existing generate-workout endpoint
        const workoutResponse = await fetch(`http://localhost:${process.env.PORT}/api/generate-workout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, preferences, duration, difficulty })
        });
        
        const workoutData = await workoutResponse.json();
        
        if (workoutData.success) {
          res.json({
            response: `Great! I've created a ${duration}-minute ${difficulty} workout for you: "${workoutData.workout.name}". It's been automatically saved to your library!

Here's what I've prepared:
- Duration: ${duration} minutes
- Difficulty: ${difficulty}
- Estimated calories: ${workoutData.workout.estimatedCalories}

Would you like me to walk you through the exercises?`,
            workoutGenerated: true,
            workoutId: workoutData.workout.id
          });
          return;
        }
      }
      
      // Regular conversation
      const aiResponse = await geminiHelper.chat(message);
      res.json({ response: aiResponse });
      
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });

  // Workout Generation with Auto-Save
  app.post("/api/generate-workout", async (req, res) => {
    try {
      const { userId, preferences, duration, difficulty } = req.body;
      
      const prompt = `Generate a ${duration}-minute ${difficulty} fitness workout routine.
      User preferences: ${preferences || 'general fitness'}
      
      Return ONLY valid JSON in this exact format, no other text:
      {
        "name": "Workout name",
        "description": "Brief description",
        "warmup": [
          {
            "name": "Exercise name",
            "duration": "X seconds",
            "instructions": "How to perform"
          }
        ],
        "main": [
          {
            "name": "Exercise name",
            "sets": 3,
            "reps": "12-15",
            "rest": "60 seconds",
            "instructions": "How to perform"
          }
        ],
        "cooldown": [
          {
            "name": "Exercise name",
            "duration": "X seconds",
            "instructions": "How to perform"
          }
        ]
      }`;

      const geminiResponse = await geminiHelper.generateContent([{
        role: "user",
        content: prompt,
        timestamp: new Date().toISOString()
      }]);
      
      // Extract JSON from response
      const jsonMatch = geminiResponse.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const workoutData = JSON.parse(jsonMatch[0]);
      
      // Calculate additional metadata
      const exerciseCount = workoutData.warmup.length + workoutData.main.length + workoutData.cooldown.length;
      const estimatedCalories = calculateCalories(duration, difficulty);
      const targetMuscleGroups = extractMuscleGroups(workoutData);
      const tags = generateTags(workoutData, preferences, difficulty);
      
      // Save to database
      const [savedWorkout] = await db.insert(workouts).values({
        userId,
        name: workoutData.name,
        description: workoutData.description,
        duration,
        difficulty,
        createdBy: 'ai-agent',
        autoGenerated: true,
        metadata: {
          exercises: {
            warmup: workoutData.warmup,
            main: workoutData.main,
            cooldown: workoutData.cooldown
          },
          generatedAt: new Date().toISOString()
        },
        estimatedCalories,
        targetMuscleGroups,
        tags,
        analytics: {
          timesCompleted: 0,
          lastCompleted: null
        }
      }).returning();
      
      res.json({
        success: true,
        workout: savedWorkout,
        message: 'Workout generated and saved!',
        savedToLibrary: true
      });
      
    } catch (error) {
      console.error('Workout generation error:', error);
      res.status(500).json({ error: 'Failed to generate workout' });
    }
  });

  // Helper functions (add these at the bottom of the file)
  function extractDuration(message: string): number | null {
    const match = message.match(/(\d+)\s*(?:minute|min)/i);
    return match ? parseInt(match[1]) : null;
  }

  function extractDifficulty(message: string): string {
    if (/beginner|easy|simple/i.test(message)) return 'beginner';
    if (/advanced|hard|challenging/i.test(message)) return 'advanced';
    return 'intermediate';
  }

  function extractPreferences(message: string): string {
    const preferences = [];
    if (/cardio/i.test(message)) preferences.push('cardio');
    if (/strength/i.test(message)) preferences.push('strength');
    if (/hiit/i.test(message)) preferences.push('hiit');
    if (/yoga|flexibility/i.test(message)) preferences.push('flexibility');
    return preferences.join(', ') || 'general fitness';
  }

  function calculateCalories(duration: number, difficulty: string): number {
    type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
    const rates: Record<DifficultyLevel, number> = { beginner: 5, intermediate: 8, advanced: 11 };
    return duration * (rates[difficulty.toLowerCase() as DifficultyLevel] || 8);
  }

  function extractMuscleGroups(workoutData: any): string[] {
    const muscles = new Set<string>();
    const exerciseText = JSON.stringify(workoutData).toLowerCase();
    
    if (exerciseText.includes('squat') || exerciseText.includes('lunge')) muscles.add('legs');
    if (exerciseText.includes('push') || exerciseText.includes('press')) muscles.add('chest');
    if (exerciseText.includes('plank') || exerciseText.includes('crunch')) muscles.add('core');
    if (exerciseText.includes('curl') || exerciseText.includes('row')) muscles.add('arms');
    
    return Array.from(muscles);
  }

  function generateTags(workoutData: any, preferences: string, difficulty: string): string[] {
    const tags = [difficulty.toLowerCase()];
    if (preferences) tags.push(...preferences.split(', '));
    return tags;
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
