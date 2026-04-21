import { appStore } from "./app";
import type { Habit } from "@/core/types/habit";
import { generateId } from "@/utils/generateId";
import { slugify } from "@/utils/slugify";
import dayjs from "dayjs";

/**
 * Adds a new habit to the state.
 * Returns the newly created habit (with id + slug)
 */
export const addHabit = (habit: Partial<Habit>): Habit => {
  const newHabit: Habit = {
    id: generateId(),
    title: habit.title ?? "New Habit",
    slug: `${slugify(habit.title ?? "New Habit")}-${Date.now()}`,
    icon: habit.icon ?? "📝",
    target: habit.target ?? 30,
    streak: habit.streak ?? 0,
    history: habit.history ?? [],
    startDate: habit.startDate ?? dayjs().format("YYYY-MM-DD"),
  };
  appStore.habits.push(newHabit);
  return newHabit;
};

/**
 * Updates an existing habit by ID (internal)
 */
export const updateHabit = (id: string, updatedFields: Partial<Habit>) => {
  const idx = appStore.habits.findIndex((h: Habit) => h.id === id);
  if (idx !== -1) Object.assign(appStore.habits[idx], updatedFields);
};

/**
 * Deletes a habit by ID (internal)
 */
export const deleteHabit = (id: string) => {
  const idx = appStore.habits.findIndex((h: Habit) => h.id === id);
  if (idx !== -1) appStore.habits.splice(idx, 1);
};

/**
 * Resets a habit's progress by ID
 */
export const resetHabit = (id: string) => {
  updateHabit(id, { streak: 0, history: [] });
};

/**
 * Marks a habit as completed for today (by ID)
 */
export const completeHabit = (id: string): boolean => {
  const idx = appStore.habits.findIndex((h: Habit) => h.id === id);
  if (idx === -1) return false;
  const habit = appStore.habits[idx];
  const today = dayjs().format("YYYY-MM-DD");
  if (habit.history.includes(today)) return false;
  (appStore.habits[idx] as Habit).streak++;
  (appStore.habits[idx] as Habit).history.push(today);
  return true;
};

/**
 * Reorder habits by ID array
 */
export const reorderHabits = (habitIds: string[]) => {
  const reordered = habitIds
    .map((id) => appStore.habits.find((h: Habit) => h.id === id))
    .filter((h): h is Habit => h !== undefined);
  appStore.habits.splice(0, appStore.habits.length, ...reordered);
};

/**
 * Helper to find a habit by slug (for URLs)
 */
export const findHabitBySlug = (slug: string): Habit | undefined => {
  return appStore.habits.find((h: Habit) => h.slug === slug);
};
