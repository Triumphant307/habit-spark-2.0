import { reactify } from "../reactor/reactify";

const defaultState = {
  user: {
    visitedHome: false,
  },

  habits: []
};

// 1️⃣ Read previous state from localStorage (Safe for SSR)
const getInitialState = () => {
  if (typeof window === "undefined") return defaultState;
  try {
    const storedState = localStorage.getItem("appState");
    const parsedState = storedState ? JSON.parse(storedState) : defaultState;

    // Sanitize: Ensure all habits have an ID
    if (Array.isArray(parsedState.habits)) {
      parsedState.habits = parsedState.habits.map((h: any, i: number) => ({
        ...h,
        id: h.id ?? Date.now() + i, // Assign ID if missing
      }));
    }

    return parsedState;
  } catch (e) {
    console.error("Failed to load state", e);
    return defaultState;
  }
};

// 2️⃣ Wrap with Reactor
export const appState = reactify(getInitialState());

// 3️⃣ Persist any state changes to localStorage
appState.on("*", () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("appState", JSON.stringify(appState));
  }
});
