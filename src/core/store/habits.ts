import { appStore } from "./app";
import type { Habit } from "@/core/types/habit";
import { generateId } from "@/utils/generateId";
import { slugify } from "@/utils/slugify";
import { fanout } from "sia-reactor/utils";
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
    category: habit.category,
    startDate: habit.startDate ?? dayjs().format("YYYY-MM-DD"),
  };
  appStore.habits.push(newHabit);
  return newHabit;
};

/**
 * Updates an existing habit by ID (internal)
 */
export const updateHabit = (id: string, updatedFields: Partial<Habit>) => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx !== -1) Object.assign(appStore.habits[idx], updatedFields);
};

/**
 * Deletes a habit by ID (internal)
 */
export const deleteHabit = (id: string) => {
  const idx = appStore.habits.findIndex((h) => h.id === id);
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
  const idx = appStore.habits.findIndex((h) => h.id === id);
  if (idx === -1) return false;
  const today = dayjs().format("YYYY-MM-DD");
  if (appStore.habits[idx].history.includes(today)) return false;
  appStore.habits[idx].streak++;
  appStore.habits[idx].history.push(today);
  return true;
};

/**
 * Reorder habits by ID
 */
export const reorderByIds = (draggedId: string, targetId: string) => {
  const from = appStore.habits.findIndex((x) => x.id === draggedId),
    to = appStore.habits.findIndex((x) => x.id === targetId);
  if (from === -1 || to === -1) return;
  const [item] = appStore.habits.splice(from, 1);
  appStore.habits.splice(to, 0, item);
};

/**
 * Helper to find a habit by slug (for URLs)
 */
export const findHabitBySlug = (slug: string): Habit | undefined => {
  return appStore.habits.find((h) => h.slug === slug);
};
