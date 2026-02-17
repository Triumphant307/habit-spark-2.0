/**
 * Represents a user's habit with tracking and reminder capabilities
 */
export interface Habit {
  /** Unique identifier for the habit */
  id: string;

  /** Display name of the habit */
  title: string;

  /** Emoji icon representing the habit */
  icon: string;

  /** Daily target count for the habit */
  target: number;

  /** Current streak count (consecutive days) */
  streak: number;

  /**
   * History of completed dates in ISO 8601 format (YYYY-MM-DD)
   * Each string represents a date when the habit was completed
   */
  history: string[]; // ISO date strings like "2024-02-17"

  /** URL-friendly slug for routing */
  slug: string;

  /** Date when habit was created (ISO 8601 format) */
  startDate: string;

  /** Optional date when tracking began (ISO 8601 format) */
  trackingStartDate?: string;

  // Reminder/Notification fields
  /** Whether reminders are enabled for this habit */
  reminderEnabled?: boolean;

  /** Time for daily reminder in HH:MM format (24-hour) */
  reminderTime?: string;

  // Status fields
  /** Whether the habit is currently active */
  isActive?: boolean;

  /** Whether the habit has been completed/achieved */
  isCompleted?: boolean;

  /** Whether the habit is archived (hidden from main view) */
  isArchived?: boolean;

  // Scheduling fields
  /**
   * Frequency of the habit
   * @default "daily"
   */
  frequency?: "daily" | "weekly" | "custom";

  /**
   * Custom frequency details (e.g., specific days of week)
   * Only used when frequency is "custom" or "weekly"
   */
  customFrequency?: {
    /** Days of week (0-6, where 0 is Sunday) */
    daysOfWeek?: number[];
    /** Interval in days (e.g., every 2 days) */
    interval?: number;
  };
}

/**
 * Type guard to check if history dates are valid ISO strings
 */
export function isValidHabitHistory(history: string[]): boolean {
  return history.every((date) => {
    const parsed = Date.parse(date);
    return !isNaN(parsed);
  });
}

/**
 * Helper type for creating a new habit (excludes computed fields)
 */
export type NewHabit = Omit<Habit, "id" | "slug" | "streak"> & {
  id?: string;
  slug?: string;
  streak?: number;
};
