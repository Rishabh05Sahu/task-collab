"use client";

import { create } from "zustand";
import axios from "axios";

interface AnalyticsState {
  data: any;
  loading: boolean;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  loading: false,

  fetchAnalytics: async () => {
    try {
      set({ loading: true });

      const res = await axios.get("/api/analytics/summary");

      set({ data: res.data, loading: false });
    } catch (error) {
      console.error("Analytics fetch failed:", error);
      set({ loading: false });
    }
  },
}));