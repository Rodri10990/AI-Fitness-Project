import { create } from 'zustand';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  notes?: string;
  rest?: number;
}

export interface RoutineDay {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  days: RoutineDay[];
  createdAt: string;
  updatedAt: string;
  lastPerformedDay?: string;
  lastPerformedDate?: string;
  favorite?: boolean;
}

interface RoutineState {
  routines: Routine[];
  selectedRoutine: Routine | null;
  selectedDay: RoutineDay | null;
  setSelectedRoutine: (routineId: string | null) => void;
  setSelectedDay: (dayId: string | null) => void;
  toggleFavorite: (routineId: string) => void;
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const useRoutineStore = create<RoutineState>()((set, get) => ({
  routines: [
    {
      id: '1',
      name: 'Trial 1',
      description: 'A 3-day full body workout routine for beginners',
      days: [
        {
          id: 'day1',
          name: 'Day 1 - Push Day',
          description: 'Chest, shoulders, and triceps',
          exercises: [
            {
              name: 'Bench Press',
              sets: 3,
              reps: 10,
              rest: 90,
              notes: 'Keep elbows at a 45-degree angle'
            },
            {
              name: 'Push-ups',
              sets: 3,
              reps: 12,
              rest: 60,
              notes: 'Keep core tight and body in straight line'
            },
            {
              name: 'Overhead Press',
              sets: 3,
              reps: 10,
              rest: 90,
              notes: 'Press straight up, engage core for stability'
            },
            {
              name: 'Tricep Dips',
              sets: 3,
              reps: 12,
              rest: 60,
              notes: 'Lower slowly, keep body close to bench'
            },
            {
              name: 'Lateral Raises',
              sets: 3,
              reps: 15,
              rest: 60,
              notes: 'Slight bend in elbows, control the weight down'
            }
          ],
          duration: 55
        },
        {
          id: 'day2',
          name: 'Day 2 - Pull Day',
          description: 'Back and biceps',
          exercises: [
            {
              name: 'Pull-ups',
              sets: 3,
              reps: 8,
              rest: 90,
              notes: 'Pull chest to bar, control the descent'
            },
            {
              name: 'Bent-over Rows',
              sets: 3,
              reps: 10,
              rest: 90,
              notes: 'Keep back straight, pull to lower chest'
            },
            {
              name: 'Lat Pulldowns',
              sets: 3,
              reps: 12,
              rest: 60,
              notes: 'Pull to upper chest, squeeze shoulder blades'
            },
            {
              name: 'Bicep Curls',
              sets: 3,
              reps: 12,
              rest: 60,
              notes: 'Keep elbows stationary, full range of motion'
            },
            {
              name: 'Face Pulls',
              sets: 3,
              reps: 15,
              rest: 60,
              notes: 'Pull to face level, squeeze rear delts'
            }
          ],
          duration: 58
        },
        {
          id: 'day3',
          name: 'Day 3 - Leg Day',
          description: 'Legs and core',
          exercises: [
            {
              name: 'Squats',
              sets: 3,
              reps: 10,
              rest: 120,
              notes: 'Keep weight in heels'
            },
            {
              name: 'Deadlifts',
              sets: 3,
              reps: 8,
              rest: 120,
              notes: 'Maintain neutral spine'
            },
            {
              name: 'Lunges',
              sets: 3,
              reps: 12,
              rest: 60,
              notes: 'Step forward, keep front knee over ankle'
            },
            {
              name: 'Leg Press',
              sets: 3,
              reps: 12,
              rest: 90,
              notes: 'Lower to 90 degrees, push through heels'
            },
            {
              name: 'Planks',
              sets: 3,
              duration: 30,
              rest: 45,
              notes: 'Keep body straight, engage core muscles'
            },
            {
              name: 'Russian Twists',
              sets: 3,
              reps: 20,
              rest: 45,
              notes: 'Lean back, twist side to side, keep feet up'
            }
          ],
          duration: 65
        }
      ],
      createdAt: '2023-05-15T10:00:00Z',
      updatedAt: '2023-05-15T10:00:00Z',
      lastPerformedDay: 'Day 2 - Pull Day',
      lastPerformedDate: 'yesterday',
      favorite: true
    }
  ],
  selectedRoutine: null,
  selectedDay: null,

  setSelectedRoutine: (routineId) => {
    const { routines } = get();
    if (!routineId) {
      set({ selectedRoutine: null, selectedDay: null });
      return;
    }
    
    const routine = routines.find(r => r.id === routineId) || null;
    set({ selectedRoutine: routine, selectedDay: null });
  },

  setSelectedDay: (dayId) => {
    const { selectedRoutine } = get();
    if (!dayId || !selectedRoutine) {
      set({ selectedDay: null });
      return;
    }
    
    const day = selectedRoutine.days.find(d => d.id === dayId) || null;
    set({ selectedDay: day });
  },

  toggleFavorite: (routineId) => {
    set(state => ({
      routines: state.routines.map(routine => 
        routine.id === routineId 
          ? { ...routine, favorite: !routine.favorite } 
          : routine
      )
    }));
  },

  addRoutine: (routine) => {
    const newRoutine: Routine = {
      ...routine,
      id: `routine_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      routines: [...state.routines, newRoutine]
    }));
  }
}));