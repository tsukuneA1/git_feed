import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/lib/api/generated";
import {
  logout as authLogout,
  getCurrentUserData,
  isAuthenticated,
  setTokens,
} from "@/services/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (accessToken: string, refreshToken: string) => {
        setTokens({ accessToken, refreshToken });
        await get().fetchUser();
        set({ isAuthenticated: true });
      },

      logout: async () => {
        await authLogout();
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        const result = await getCurrentUserData();

        if (result.success) {
          set({ user: result.data });
        } else {
          console.error("Failed to fetch user:", result.error);
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        if (isAuthenticated()) {
          const result = await getCurrentUserData();

          if (result.success) {
            set({ user: result.data, isAuthenticated: true });
          } else {
            console.error("Auth check failed:", result.error);
            set({ user: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }

        set({ isLoading: false });
      },
    }),
    {
      name: "auth-store",
    },
  ),
);
