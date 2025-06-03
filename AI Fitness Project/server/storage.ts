import { users, workouts, type User, type InsertUser, AiConversation, InsertAiConversation, MessageEntry, aiConversations } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AI Conversation methods
  getConversation(id: number): Promise<AiConversation | undefined>;
  getLatestConversation(userId: number): Promise<AiConversation | undefined>;
  createConversation(userId: number, messages: MessageEntry[]): Promise<AiConversation>;
  updateConversation(id: number, messages: MessageEntry[]): Promise<AiConversation>;
  
  // AI Routine methods
  saveAIRoutine(userId: number, routineData: any): Promise<any>;
  getUserRoutines(userId: number): Promise<any[]>;
  
  // Workout methods
  createWorkout(workoutData: any): Promise<any>;
  getUserWorkouts(userId: number): Promise<any[]>;
  getWorkout(workoutId: number, userId: number): Promise<any | undefined>;
  deleteWorkout(workoutId: number, userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // AI Conversation methods
  async getConversation(id: number): Promise<AiConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, id));
    
    return conversation;
  }
  
  async getLatestConversation(userId: number): Promise<AiConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.updatedAt))
      .limit(1);
    
    return conversation;
  }
  
  async createConversation(userId: number, messages: MessageEntry[]): Promise<AiConversation> {
    const now = new Date();
    
    const [conversation] = await db
      .insert(aiConversations)
      .values({
        userId,
        messages,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    
    return conversation;
  }
  
  async updateConversation(id: number, messages: MessageEntry[]): Promise<AiConversation> {
    const [updatedConversation] = await db
      .update(aiConversations)
      .set({
        messages,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, id))
      .returning();
    
    if (!updatedConversation) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    
    return updatedConversation;
  }

  async saveAIRoutine(userId: number, routineData: any): Promise<any> {
    // Create a routine compatible with your existing workout system
    const routine = {
      id: Date.now().toString(),
      userId,
      name: routineData.name,
      description: routineData.description,
      days: routineData.days,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false
    };
    return routine;
  }

  async getUserRoutines(userId: number): Promise<any[]> {
    // For now, return empty array - will integrate with existing routine system
    return [];
  }

  async createWorkout(workoutData: any): Promise<any> {
    const [workout] = await db
      .insert(workouts)
      .values({
        userId: workoutData.userId,
        name: workoutData.name,
        description: workoutData.description,
        duration: workoutData.duration,
        difficulty: workoutData.difficulty
      })
      .returning();
    return workout;
  }

  async getUserWorkouts(userId: number): Promise<any[]> {
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId.toString()));
    return userWorkouts;
  }

  async getWorkout(workoutId: number, userId: number): Promise<any | undefined> {
    const [workout] = await db
      .select()
      .from(workouts)
      .where(eq(workouts.id, workoutId));
    return workout || undefined;
  }

  async deleteWorkout(workoutId: number, userId: number): Promise<void> {
    await db
      .delete(workouts)
      .where(eq(workouts.id, workoutId));
  }
}

// Comment out the MemStorage and use DatabaseStorage instead
// export class MemStorage implements IStorage { ... }

export const storage = new DatabaseStorage();
