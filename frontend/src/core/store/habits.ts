import { appStore } from "./app";
import type { Habit } from "@/core/types/habit";
import { generateId } from "@/utils/generateId";
import { slugify } from "@/utils/slugify";
import dayjs from "dayjs";
import toast from "@/utils/toast";
import {
  fetchHabitsApi,
  createHabitApi,
  updateHabitApi,
  deleteHabitApi,
  completeHabitApi,
  resetHabitApi,
  reorderHabitsApi,
} from "@/services/habitApi";
import logger from "@/utils/logger";

/**
 * Fetches all habits and populates the store.
 */
export const fetchHabitsAction = async () => {
  try {
    const habits = await fetchHabitsApi();
    appStore.habits = habits;
  } catch (error) {
    logger.error("Failed to fetch habits", { error });
    // Not throwing to avoid crashing the app on load
  }
};

/**
 * Adds a new habit to the state.
 * Waits for the API to return the true database record.
 */
export const addHabit = async (habit: Partial<Habit>): Promise<Habit> => {
  try {
    const newHabitData: Partial<Habit> = {
      title: habit.title ?? "New Habit",
      icon: habit.icon ?? "📝",
      target: habit.target ?? 30,
      category: habit.category ?? "General",
    };

    const createdHabit = await createHabitApi(newHabitData);
    
    // Fallback if backend doesn't return full object
    const finalHabit: Habit = {
      id: createdHabit.id || generateId(),
      title: createdHabit.title || newHabitData.title!,
      slug: createdHabit.slug || `${slugify(newHabitData.title!)}-${Date.now()}`,
      icon: createdHabit.icon || newHabitData.icon!,
      target: createdHabit.target || newHabitData.target!,
      streak: createdHabit.streak || 0,
      history: createdHabit.history || [],
      category: createdHabit.category,
      startDate: createdHabit.startDate || dayjs().format("YYYY-MM-DD"),
    };

    appStore.habits.push(finalHabit);
    return finalHabit;
  } catch (error) {
    logger.error("Failed to create habit", { error });
    toast.error("Failed to create habit.");
    throw error;
  }
};

/**
 * Updates an existing habit by ID (optimistic update)
 */
export const updateHabit = (id: string, updatedFields: Partial<Habit>) => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx === -1) return;

  // Snapshot for rollback
  const originalHabit = { ...appStore.habits[idx] };

  // Optimistic update
  Object.assign(appStore.habits[idx], updatedFields);

  // Fire and forget
  updateHabitApi(id, updatedFields).catch((error) => {
    logger.error("Failed to update habit", { error });
    toast.error("Failed to save changes.");
    // Rollback
    Object.assign(appStore.habits[idx], originalHabit);
  });
};

/**
 * Deletes a habit by ID (optimistic update)
 */
export const deleteHabit = (id: string) => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx === -1) return;

  const originalHabit = appStore.habits[idx];
  
  // Optimistic delete
  appStore.habits.splice(idx, 1);

  // Fire and forget
  deleteHabitApi(id).catch((error) => {
    logger.error("Failed to delete habit", { error });
    toast.error("Failed to delete habit.");
    // Rollback
    appStore.habits.splice(idx, 0, originalHabit);
  });
};

/**
 * Resets a habit's progress by ID (optimistic update)
 */
export const resetHabit = (id: string) => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx === -1) return;

  const originalStreak = appStore.habits[idx].streak;
  const originalHistory = [...appStore.habits[idx].history];

  // Optimistic reset
  appStore.habits[idx].streak = 0;
  appStore.habits[idx].history = [];

  // Fire and forget
  resetHabitApi(id).catch((error) => {
    logger.error("Failed to reset habit", { error });
    toast.error("Failed to reset progress.");
    // Rollback
    appStore.habits[idx].streak = originalStreak;
    appStore.habits[idx].history = originalHistory;
  });
};

/**
 * Marks a habit as completed for today (optimistic update)
 */
export const completeHabit = (id: string): boolean => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx === -1) return false;

  const today = dayjs().format("YYYY-MM-DD");
  if (appStore.habits[idx].history.includes(today)) return false;

  // Optimistic update
  appStore.habits[idx].streak++;
  appStore.habits[idx].history.push(today);

  // Fire and forget
  completeHabitApi(id, today).catch((error) => {
    logger.error("Failed to complete habit", { error });
    toast.error("Failed to log completion.");
    // Rollback
    appStore.habits[idx].streak--;
    appStore.habits[idx].history.pop();
  });

  return true;
};

/**
 * Reorder habits by ID (optimistic update)
 */
export const reorderByIds = (draggedId: string, targetId: string) => {
  const from = appStore.habits.findIndex((x) => x.id === draggedId),
    to = appStore.habits.findIndex((x) => x.id === targetId);
  if (from === -1 || to === -1) return;

  // Snapshot for rollback
  const originalOrder = [...appStore.habits];

  // Optimistic reorder
  const [item] = appStore.habits.splice(from, 1);
  appStore.habits.splice(to, 0, item);

  // Fire and forget
  const newOrderIds = appStore.habits.map((h) => h.id);
  reorderHabitsApi(newOrderIds).catch((error) => {
    logger.error("Failed to reorder habits", { error });
    toast.error("Failed to save new order.");
    // Rollback
    appStore.habits.splice(0, appStore.habits.length, ...originalOrder);
  });
};

/**
 * Helper to find a habit by slug (for URLs)
 */
export const findHabitBySlug = (slug: string): Habit | undefined => {
  return appStore.habits.find((h) => h.slug === slug);
};
