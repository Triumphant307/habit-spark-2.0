import { reactive } from "sia-reactor";
import { PersistModule, TimeTravelModule } from "sia-reactor/modules";
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

export const time = new TimeTravelModule();
export const persist = new PersistModule({
  key: "HABIT_SPARK",
  throttle: 2500,
}).attach(time.state, "timeTravel");
export const appState = reactive(defaultState);

// Application Modules Setup
appState.use(persist, "app").use(time);
