import type { Habit } from "@/core/types/habit";

export interface Tip {
  id?: string | number;
  title: string;
  category?: string;
  icon?: string;
  history?: string[];
  [key: string]: unknown;
}

export interface Reminder {
  habitTitle: string;
  habitIcon: string;
  time: string;
  nextScheduled: string;
}

export interface AppStore {
  theme: "light" | "dark" | undefined;
  user: {
    visitedHome: boolean;
    nickname: string;
    goals: string[];
    completedOnboarding: boolean;
    preferences: {
      sidebarCollapsed: boolean;
      mobileMenuOpen: boolean;
    };
    motivation: {
      quote: string;
      author: string;
      lastUpdated: string | null;
    };
  };
  habits: Habit[];
  suggestions: {
    filter: string;
    viewMode: "grid" | "list";
    favorites: Tip[];
  };
  scheduledReminders: Record<string, Reminder>;
}
