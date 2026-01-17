import { reactify } from "../reactor/reactify";

export const appState = reactify({
  user: {
    visitedHome: false,
  },
})