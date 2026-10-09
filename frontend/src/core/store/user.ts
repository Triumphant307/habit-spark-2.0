import { appStore } from "./app";
import { OnboardingData } from "@/types/onboarding";
import logger from "@/utils/logger";
import { onboardingApi } from "@/services/userApi";
import toast from "@/utils/toast";
import { fetchHabitsAction } from "./habits";

/**
 * Updates the user's profile based on onboarding data
 */
export const completeOnboarding = async (data: OnboardingData): Promise<boolean> => {
  try {
    // 1. Save to backend
    const result = await onboardingApi({
      nickname: data.nickname,
      goal: data.goals[0] || "Other",
      commitment: data.frequency,
      firstHabit: {
        title: data.firstHabit,
        target: 30,
        icon: "✨",
        category: "General",
      },
    });

    // 2. Update local state
    appStore.user.nickname = data.nickname;
    appStore.user.goals = data.goals;
    appStore.user.completedOnboarding = true;

    // Fetch the real habits from the backend to ensure we have the exact DB IDs and slugs
    await fetchHabitsAction();

    logger.info("Onboarding completed", { nickname: data.nickname });
    return true;
  } catch (error) {
    logger.error("Failed to complete onboarding", error);
    toast.error("Failed to save your progress. Please try again.");
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

/**
 * Toggles the notification modal state
 */
export const toggleNotificationModal = (forceState?: boolean) => {
  appStore.user.preferences.notificationModalOpen =
    forceState !== undefined ? forceState : !appStore.user.preferences.notificationModalOpen;
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = (id: string) => {
  const notification = appStore.notifications.find((n) => n.id === id);
  if (notification) {
    notification.isRead = true;
  }
};
