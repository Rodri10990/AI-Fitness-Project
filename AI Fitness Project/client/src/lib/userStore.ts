import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  name: string;
  username: string;
  email: string;
  phone: string;
  memberSince: string;
  weight: number;
  weightUnit: string;
  bodyFat: number;
  avatarInitials: string;
  setUser: (user: Partial<UserState>) => void;
}

const initialState = {
  name: 'Jamie Smith',
  username: 'jamiesmith',
  email: 'jamie.smith@example.com',
  phone: '(555) 123-4567',
  memberSince: 'May 2024',
  weight: 175,
  weightUnit: 'lbs',
  bodyFat: 18.5,
  avatarInitials: 'JS',
  setUser: (user: Partial<Omit<UserState, 'setUser'>>) => {}
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set((state) => ({ ...state, ...user })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);