import { appState } from "../state/state";
import { OnboardingData } from "@/types/onboarding";
import logger from "@/utils/logger";

/**
 * Updates the user's profile based on onboarding data
 */
export const completeOnboardingIntent = (data: OnboardingData) => {
  try {
    // 1. Update user info
    appState.set("user.nickname", data.nickname);
    appState.set("user.goals", data.goals);
    appState.set("user.completedOnboarding", true);

    // 2. Create the first habit from onboarding
    const newHabit = {
      id: Date.now(),
      title: data.firstHabit,
      icon: "✨", // Default icon for first habit
      streak: 0,
      target: 30, // Default target
      history: [],
      category: data.goals[0] || "General",
      frequency: data.frequency,
      createdAt: new Date().toISOString(),
    };

    const currentHabits = appState.get("habits") || [];
    appState.set("habits", [...currentHabits, newHabit]);

    logger.info("Onboarding completed and state updated", {
      nickname: data.nickname,
    });
    return true;
  } catch (error) {
    logger.error("Failed to complete onboarding intent", error);
    return false;
  }
};

/**
 * Updates only the user's nickname
 */
export const updateNicknameIntent = (nickname: string) => {
  appState.set("user.nickname", nickname);
};

/**
 * Toggles the sidebar collapse state
 */
export const toggleSidebarIntent = () => {
  const current = appState.get("user.preferences.sidebarCollapsed");
  appState.set("user.preferences.sidebarCollapsed", !current);
};

/**
 * Toggles the mobile menu (hamburger) state
 */
export const toggleMobileMenuIntent = (forceState?: boolean) => {
  const current = appState.get("user.preferences.mobileMenuOpen");
  appState.set(
    "user.preferences.mobileMenuOpen",
    forceState !== undefined ? forceState : !current,
  );
};
