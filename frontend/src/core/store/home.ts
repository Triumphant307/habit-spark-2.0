import { appStore } from "./app";

export const trackHomeVisit = (): boolean => {
  if (!appStore.user.visitedHome) {
    appStore.user.visitedHome = true;
    return false;
  }

  return true;
};
