import { appStore } from "./app";
import { OnboardingData } from "@/types/onboarding";
import logger from "@/utils/logger";

/**
 * Updates the user's profile based on onboarding data
 */
export const completeOnboarding = (data: OnboardingData) => {
  try {
    appStore.user.nickname = data.nickname;
    appStore.user.goals = data.goals;
    appStore.user.completedOnboarding = true;
    const newHabit = {
      id: String(Date.now()),
      title: data.firstHabit,
      slug: `${data.firstHabit.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      icon: "✨",
      streak: 0,
      target: 30,
      history: [],
      startDate: new Date().toISOString().split("T")[0],
    };
    appStore.habits.push(newHabit);
    logger.info("Onboarding completed", { nickname: data.nickname });
    return true;
  } catch (error) {
    logger.error("Failed to complete onboarding", error);
    return false;
  }
};

/**
 * Updates only the user's nickname
 */
export const updateNickname = (nickname: string) => {
  appStore.user.nickname = nickname;
};

/**
 * Toggles the sidebar collapse state
 */
export const toggleSidebar = () => {
  appStore.user.preferences.sidebarCollapsed = !appStore.user.preferences.sidebarCollapsed;
};

/**
 * Toggles the mobile menu (hamburger) state
 */
export const toggleMobileMenu = (forceState?: boolean) => {
  appStore.user.preferences.mobileMenuOpen =
    forceState !== undefined ? forceState : !appStore.user.preferences.mobileMenuOpen;
};
