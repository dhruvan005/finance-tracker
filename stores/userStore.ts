import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
