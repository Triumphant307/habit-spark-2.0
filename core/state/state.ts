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
    return storedState ? JSON.parse(storedState) : defaultState;
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
