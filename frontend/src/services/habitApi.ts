import api from "./api";
import type { Habit } from "@/core/types/habit";

/**
 * Fetches all habits for the authenticated user.
 */
export const fetchHabitsApi = async (): Promise<Habit[]> => {
  const response = await api.get<Habit[]>("/habits");
  return response.data;
};

/**
 * Creates a new habit.
 */
export const createHabitApi = async (habitData: Partial<Habit>): Promise<Habit> => {
  const response = await api.post<Habit>("/habits", habitData);
  return response.data;
};

/**
 * Updates an existing habit by ID.
 */
export const updateHabitApi = async (id: string, habitData: Partial<Habit>): Promise<Habit> => {
  const response = await api.patch<Habit>(`/habits/${id}`, habitData);
  return response.data;
};

/**
 * Deletes a habit by ID.
 */
export const deleteHabitApi = async (id: string): Promise<void> => {
  await api.delete(`/habits/${id}`);
};

/**
 * Marks a habit as completed for a specific date.
 */
export const completeHabitApi = async (id: string, date: string): Promise<void> => {
  await api.post(`/habits/${id}/complete`, { date });
};

/**
 * Resets a habit's streak and history.
 */
export const resetHabitApi = async (id: string): Promise<void> => {
  await api.post(`/habits/${id}/reset`);
};

/**
 * Saves the reordered list of habits.
 */
export const reorderHabitsApi = async (idArray: string[]): Promise<void> => {
  await api.post("/habits/reorder", { idArray });
};
