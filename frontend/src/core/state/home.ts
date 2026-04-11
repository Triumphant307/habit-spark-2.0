import { appState } from "./app";

export const trackHomeVisit = (): boolean => {
  if (!appState.user.visitedHome) {
    console.log("First time home visit");
    appState.user.visitedHome = true;
    return false;
  }
  console.log("Welcome back!");
  return true;
};
