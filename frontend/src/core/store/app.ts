import { reactive } from "sia-reactor";
import { PersistModule, TimeTravelModule, LocalStorageAdapter } from "sia-reactor/modules";
import type { AppStore } from "@/core/types/app";

const defaultStore: AppStore = {
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
  scheduledReminders: {},
};

export const storageKey = "HABIT_SPARK";
export const persistor = new LocalStorageAdapter<AppStore>({ key: storageKey });
export const time = new TimeTravelModule({
  blacklist: ["user.goals", "habits", "suggestions.favorites"],
});
export const persist = new PersistModule({
  key: storageKey,
  throttle: 2500,
  adapter: persistor,
}).attach(time.state, "timeTravel");
export const appStore = reactive(defaultStore);

// Application Modules Setup
appStore.use(persist, "app").use(time);

if (process.env.NODE_ENV !== "production" && "undefined" !== typeof window) {
  const w = window as any;
  w.time = time;
  w.persist = persist;
  w.appStore = appStore;
}
