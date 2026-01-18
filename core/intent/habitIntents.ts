import { appState } from "../state/state";
import type { Habit } from "../types/habit";
import dayjs from "dayjs";

/**
 * Adds a new habit to the state.
 */
export const addHabitIntent = (habit: Partial<Habit>) => {
  try {
    const habits = appState.get("habits") || [];
    const newHabit = {
      ...habit,
      id: habit.id ?? Date.now(),
      streak: habit.streak ?? 0,
      history: habit.history ?? [],
    };
    appState.set("habits", [...habits, newHabit]);
  } catch (e) {
    console.error("Failed to add habit", e);
  }
};

/**
 * Updates an existing habit by ID.
 */
export const updateHabitIntent = (
  id: number,
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
 * Deletes a habit by ID.
 */
export const deleteHabitIntent = (id: number) => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const newHabits = habits.filter((h) => h.id !== id);
    appState.set("habits", newHabits);
  } catch (e) {
    console.error("Failed to delete habit", e);
  }
};

/**
 * Resets a habit's progress.
 */
export const resetHabitIntent = (id: number) => {
  try {
    updateHabitIntent(id, { streak: 0, history: [] });
  } catch (e) {
    console.error("Failed to reset habit", e);
  }
};

/**
 * Marks a habit as completed for today.
 */
export const completeHabitIntent = (id: number): boolean => {
  try {
    const habits: Habit[] = appState.get("habits") || [];
    const habit = habits.find((h) => h.id === id);

    if (!habit) return false;

    const today = dayjs().format("YYYY-MM-DD");
    if (habit.history.includes(today)) return false; // Already completed

    const newStreak = habit.streak + 1;
    const newHistory = [...habit.history, today];

    updateHabitIntent(id, { streak: newStreak, history: newHistory });
    return true;
  } catch (e) {
    console.error("Failed to complete habit", e);
    return false;
  }
};
