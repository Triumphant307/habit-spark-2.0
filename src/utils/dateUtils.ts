import dayjs from "dayjs";
import { Habit } from "@/core/types/habit";

/**
 * Returns a time-based greeting string (Morning, Afternoon, Evening)
 */
export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

/**
 * Calculates completion counts for the last X days for the heatmap
 */
export const getHeatmapData = (habits: Habit[], days = 84) => {
  const data: Record<string, number> = {};
  const today = dayjs();

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = today.subtract(i, "day").format("YYYY-MM-DD");
    data[date] = 0;
  }

  // Populate counts from habit history
  habits.forEach((habit) => {
    habit.history.forEach((date) => {
      if (data[date] !== undefined) {
        data[date]++;
      }
    });
  });

  // Convert to array and sort by date
  return Object.entries(data)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
};
