"use client";

import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;

  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  setUser: (user) => set({ user, initialized: true }),
  clearUser: () => set({ user: null, initialized: true }),
  setInitialized: () => set({ initialized: true }),

  logout: () => set({ user: null, initialized: true }), // ✅ now exists
}));