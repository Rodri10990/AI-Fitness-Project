import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'full-body' | 'hiit' | 'custom';
  lastPerformed?: string;
  equipment?: string[];
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkoutState {
  workouts: Workout[];
  history: {
    id: string;
    workoutId: string;
    title: string;
    date: string;
    duration: number;
    completed: boolean;
  }[];
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWorkout: (id: string, workout: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteWorkout: (id: string) => void;
  addWorkoutToHistory: (workoutId: string, completed: boolean, duration: number) => void;
  toggleFavorite: (id: string) => void;
}

// Original routines from GitHub repository
const initialWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Upper Body Strength',
    description: 'Focus on building upper body strength with compound movements',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, rest: 90 },
      { name: 'Bent Over Rows', sets: 4, reps: 10, rest: 90 },
      { name: 'Overhead Press', sets: 3, reps: 10, rest: 60 },
      { name: 'Pull-ups', sets: 3, reps: 8, rest: 60 },
      { name: 'Tricep Extensions', sets: 3, reps: 12, rest: 45 },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 45 }
    ],
    duration: 45,
    level: 'intermediate',
    category: 'strength',
    equipment: ['barbell', 'dumbbells', 'pull-up bar'],
    favorite: true,
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2025-05-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Lower Body Day',
    description: 'Focus on building lower body strength with compound movements',
    exercises: [
      { name: 'Squats', sets: 4, reps: 8, rest: 90 },
      { name: 'Deadlifts', sets: 4, reps: 8, rest: 90 },
      { name: 'Lunges', sets: 3, reps: 10, rest: 60 },
      { name: 'Leg Press', sets: 3, reps: 12, rest: 60 },
      { name: 'Leg Curls', sets: 3, reps: 12, rest: 45 },
      { name: 'Calf Raises', sets: 4, reps: 15, rest: 45 }
    ],
    duration: 50,
    level: 'intermediate',
    category: 'strength',
    equipment: ['barbell', 'machines'],
    favorite: true,
    lastPerformed: 'yesterday',
    createdAt: '2025-05-11T10:00:00Z',
    updatedAt: '2025-05-11T10:00:00Z'
  },
  {
    id: '3',
    title: 'Core Conditioning',
    description: 'Strengthen your core with this focused routine',
    exercises: [
      { name: 'Planks', sets: 3, duration: 60, rest: 45 },
      { name: 'Russian Twists', sets: 3, reps: 20, rest: 45 },
      { name: 'Bicycle Crunches', sets: 3, reps: 20, rest: 45 },
      { name: 'Leg Raises', sets: 3, reps: 15, rest: 45 },
      { name: 'Mountain Climbers', sets: 3, duration: 45, rest: 45 },
      { name: 'Dead Bugs', sets: 3, reps: 12, rest: 45 }
    ],
    duration: 30,
    level: 'beginner',
    category: 'strength',
    equipment: ['none', 'yoga mat'],
    lastPerformed: '5 days ago',
    createdAt: '2025-05-12T10:00:00Z',
    updatedAt: '2025-05-12T10:00:00Z'
  },
  {
    id: '4',
    title: 'HIIT Session',
    description: 'High-intensity interval training for maximum calorie burn',
    exercises: [
      { name: 'Burpees', duration: 45, rest: 15 },
      { name: 'Mountain Climbers', duration: 45, rest: 15 },
      { name: 'Jump Squats', duration: 45, rest: 15 },
      { name: 'High Knees', duration: 45, rest: 15 },
      { name: 'Jumping Jacks', duration: 45, rest: 15 },
      { name: 'Plank Jacks', duration: 45, rest: 15 }
    ],
    duration: 25,
    level: 'intermediate',
    category: 'hiit',
    equipment: ['none'],
    lastPerformed: '1 week ago',
    createdAt: '2025-05-13T10:00:00Z',
    updatedAt: '2025-05-13T10:00:00Z'
  },
  {
    id: '5',
    title: '30-Min Full Body',
    description: 'Quick but effective full body workout',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: 12, rest: 45 },
      { name: 'Push-ups', sets: 3, reps: 10, rest: 45 },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, rest: 45 },
      { name: 'Lunges', sets: 3, reps: 10, rest: 45 },
      { name: 'Shoulder Press', sets: 3, reps: 10, rest: 45 },
      { name: 'Plank', sets: 3, duration: 30, rest: 30 }
    ],
    duration: 30,
    level: 'beginner',
    category: 'full-body',
    equipment: ['dumbbells', 'kettlebell'],
    favorite: true,
    createdAt: '2025-05-14T10:00:00Z',
    updatedAt: '2025-05-14T10:00:00Z'
  },
  {
    id: '6',
    title: 'Mobility Focus',
    description: 'Improve flexibility and joint mobility',
    exercises: [
      { name: 'Dynamic Stretches', duration: 300, notes: 'Full body' },
      { name: 'Hip Openers', sets: 3, duration: 60, notes: 'Each side' },
      { name: 'Shoulder Mobility', sets: 3, reps: 10, notes: 'Each arm' },
      { name: 'Ankle Mobility', sets: 3, duration: 60, notes: 'Each ankle' },
      { name: 'Thoracic Spine Rotation', sets: 3, reps: 10, notes: 'Each side' },
      { name: 'Deep Squat Hold', sets: 5, duration: 30 }
    ],
    duration: 35,
    level: 'beginner',
    category: 'flexibility',
    equipment: ['none', 'yoga mat'],
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T10:00:00Z'
  },
  {
    id: '7',
    title: 'Push Day',
    description: 'Focus on pushing movements for upper body',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, rest: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: 60 },
      { name: 'Shoulder Press', sets: 3, reps: 10, rest: 60 },
      { name: 'Tricep Pushdowns', sets: 3, reps: 12, rest: 45 },
      { name: 'Lateral Raises', sets: 3, reps: 15, rest: 45 },
      { name: 'Dips', sets: 3, reps: 10, rest: 60 }
    ],
    duration: 50,
    level: 'intermediate',
    category: 'strength',
    equipment: ['barbell', 'dumbbells', 'cables'],
    createdAt: '2025-05-16T10:00:00Z',
    updatedAt: '2025-05-16T10:00:00Z'
  },
  {
    id: '8',
    title: 'Pull Day',
    description: 'Focus on pulling movements for upper body',
    exercises: [
      { name: 'Deadlifts', sets: 3, reps: 8, rest: 90 },
      { name: 'Pull-ups', sets: 3, reps: 8, rest: 60 },
      { name: 'Barbell Rows', sets: 3, reps: 10, rest: 60 },
      { name: 'Face Pulls', sets: 3, reps: 15, rest: 45 },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 45 },
      { name: 'Lat Pulldowns', sets: 3, reps: 12, rest: 45 }
    ],
    duration: 50,
    level: 'intermediate',
    category: 'strength',
    equipment: ['barbell', 'dumbbells', 'cables', 'pull-up bar'],
    createdAt: '2025-05-17T10:00:00Z',
    updatedAt: '2025-05-17T10:00:00Z'
  }
];

const workoutHistory = [
  {
    id: 'h1',
    workoutId: '2',
    title: 'Lower Body Day',
    date: 'Yesterday',
    duration: 48,
    completed: true
  },
  {
    id: 'h2',
    workoutId: '1',
    title: 'Upper Body Strength',
    date: '2 days ago',
    duration: 42,
    completed: true
  },
  {
    id: 'h3',
    workoutId: '4',
    title: 'HIIT Session',
    date: '4 days ago',
    duration: 25,
    completed: false
  },
  {
    id: 'h4',
    workoutId: '3',
    title: 'Core Conditioning',
    date: '5 days ago',
    duration: 32,
    completed: true
  }
];

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      workouts: initialWorkouts,
      history: workoutHistory,
      addWorkout: (workout) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        
        set((state) => ({
          workouts: [
            ...state.workouts,
            {
              ...workout,
              id,
              createdAt: now,
              updatedAt: now
            }
          ]
        }));
        
        return id;
      },
      updateWorkout: (id, workout) => {
        set((state) => ({
          workouts: state.workouts.map((w) => 
            w.id === id 
              ? { ...w, ...workout, updatedAt: new Date().toISOString() } 
              : w
          )
        }));
      },
      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id)
        }));
      },
      addWorkoutToHistory: (workoutId, completed, duration) => {
        set((state) => {
          const workout = state.workouts.find((w) => w.id === workoutId);
          if (!workout) return state;
          
          const historyEntry = {
            id: crypto.randomUUID(),
            workoutId,
            title: workout.title,
            date: 'Today',
            duration,
            completed
          };
          
          return {
            history: [historyEntry, ...state.history],
            workouts: state.workouts.map((w) => 
              w.id === workoutId 
                ? { ...w, lastPerformed: 'Today' } 
                : w
            )
          };
        });
      },
      toggleFavorite: (id) => {
        set((state) => ({
          workouts: state.workouts.map((w) => 
            w.id === id 
              ? { ...w, favorite: !w.favorite, updatedAt: new Date().toISOString() } 
              : w
          )
        }));
      }
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);