import { reactive } from "sia-reactor";
import { PersistPlugin, TimeTravelPlugin } from "sia-reactor/plugins";
import type { AppState } from "@/core/types/app";

const defaultState: AppState = {
  theme: undefined,
  user: {
    visitedHome: false,
    nickname: "",
    goals: [],
    completedOnboarding: false,
    preferences: {
      sidebarCollapsed: false,
      mobileMenuOpen: false,
    },
    motivation: {
      quote: "Every great journey starts with a single spark.",
      author: "General",
      lastUpdated: null,
    },
  },
  habits: [],
  suggestions: {
    filter: "All",
    viewMode: "grid",
    favorites: [],
  },
};

export const appState = reactive(defaultState);
export const time = new TimeTravelPlugin();
time.state.plugIn(
  new PersistPlugin({ key: "appStateTimeTravel", throttle: 2500 }),
);
appState
  .plugIn(new PersistPlugin({ key: "appState", throttle: 2500 }))
  .plugIn(time);
