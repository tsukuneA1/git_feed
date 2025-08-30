"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  logout as authLogout,
  isAuthenticated,
  makeAuthenticatedRequest,
  setTokens,
} from "@/services/auth";

interface User {
  id: string;
  username: string;
  name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        try {
          const response = await makeAuthenticatedRequest(`${API_BASE_URL}/me`);
          if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        if (isAuthenticated()) {
          try {
            await get().fetchUser();
            set({ isAuthenticated: true });
          } catch (error) {
            console.error("Auth check failed:", error);
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
