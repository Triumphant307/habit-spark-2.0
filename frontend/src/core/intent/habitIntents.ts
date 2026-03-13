import { appState } from "../state/state";
import type { Habit } from "../types/habit";
import { generateId } from "@/app/utils/generateId";
import { slugify } from "@/app/utils/slugify";
import dayjs from "dayjs";

/**
 * Adds a new habit to the state.
 * Returns the newly created habit (with id + slug)
 */
export const addHabitIntent = (habit: Partial<Habit>): Habit => {
  try {
    const habits = appState.get("habits") || [];
    const newHabit: Habit = {
      id: generateId(), // internal unique ID
      title: habit.title ?? "New Habit",
      slug: `${slugify(habit.title ?? "New Habit")}-${Date.now()}`, // for URLs
      icon: habit.icon ?? "📝",
      target: habit.target ?? 30,
      streak: habit.streak ?? 0,
      history: habit.history ?? [],
      startDate: habit.startDate ?? dayjs().format("YYYY-MM-DD"),
    };
    appState.set("habits", [...habits, newHabit]);
    return newHabit;
  } catch (e) {
    console.error("Failed to add habit", e);
    throw e;
  }
};

/**
 * Updates an existing habit by ID (internal)
 */
export const updateHabitIntent = (
  id: string,
  updatedFields: Partial<Habit>,
) => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const newHabits = habits.map((h) =>
      h.id === id ? { ...h, ...updatedFields } : h,
    );
    appState.set("habits", newHabits);
  } catch (e) {
    console.error("Failed to update habit", e);
  }
};

/**
 * Deletes a habit by ID (internal)
 */
export const deleteHabitIntent = (id: string) => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const newHabits = habits.filter((h) => h.id !== id);
    appState.set("habits", newHabits);
  } catch (e) {
    console.error("Failed to delete habit", e);
  }
};

/**
 * Resets a habit's progress by ID
 */
export const resetHabitIntent = (id: string) => {
  try {
    updateHabitIntent(id, { streak: 0, history: [] });
  } catch (e) {
    console.error("Failed to reset habit", e);
  }
};

/**
 * Marks a habit as completed for today (by ID)
 */
export const completeHabitIntent = (id: string): boolean => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const habit = habits.find((h) => h.id === id);
    if (!habit) return false;

    const today = dayjs().format("YYYY-MM-DD");
    if (habit.history.includes(today)) return false; // Already done

    const newStreak = habit.streak + 1;
    const newHistory = [...habit.history, today];
    updateHabitIntent(id, { streak: newStreak, history: newHistory });
    return true;
  } catch (e) {
    console.error("Failed to complete habit", e);
    return false;
  }
};

/**
 * Reorder habits by ID array
 */
export const reorderHabitIntent = (habitIds: string[]) => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const reorderedHabits = habitIds
      .map((id) => habits.find((h) => h.id === id))
      .filter((h): h is Habit => h !== undefined);
    appState.set("habits", reorderedHabits);
  } catch (e) {
    console.error("Failed to reorder habits", e);
  }
};

/**
 * Helper to find a habit by slug (for URLs)
 */
export const findHabitBySlug = (slug: string): Habit | undefined => {
  const habits: Habit[] = appState.get("habits") || [];
  return habits.find((h) => h.slug === slug);
};
