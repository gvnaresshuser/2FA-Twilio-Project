import { create } from "zustand";

import {
  getCurrentUser,
  logout as logoutApi,
} from "../api/authApi";

import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;

  setUser: (user: User | null) => void;

  fetchCurrentUser: () => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,
    loading: false,
    initialized: false,

    setUser: (user) => {
      set({ user });
    },

    fetchCurrentUser: async () => {
      set({ loading: true });

      try {
        const response =
          await getCurrentUser();

        set({
          user: response.user,
          initialized: true,
        });
      } catch {
        set({
          user: null,
          initialized: true,
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    logout: async () => {
      try {
        await logoutApi();
      } finally {
        set({
          user: null,
        });
      }
    },
  }),
);