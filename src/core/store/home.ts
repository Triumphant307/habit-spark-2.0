import { appStore } from "./app";

export const trackHomeVisit = (): boolean => {
  if (!appStore.user.visitedHome) {
    console.log("First time home visit");
    appStore.user.visitedHome = true;
    return false;
  }
  console.log("Welcome back!");
  return true;
};
