import { create } from "zustand"
import { User } from "@/types"
import { signIn, signOut, signUp } from "@/lib/auth-client"

type AuthState = {
  user: null | User;
  isLoading: boolean;
  error: string | null;
  setUser: (user: AuthState['user']) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/me');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const user = await response.json();
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: error instanceof Error ? error.message : 'Logout failed', isLoading: false });
    }
  },
}))