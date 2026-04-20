import { appState } from "@/core/state/app";

/**
 * Native Browser Notification Service
 * Handles permission, scheduling, and displaying notifications
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  vibrate?: number | number[];
}

class NotificationService {
  private permission: NotificationPermission = "default";

  constructor() {
    if (typeof window !== "undefined" && "Notification" in window) this.permission = Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }
    if (this.permission === "granted") return true;
    try {
      this.permission = await Notification.requestPermission();
      return this.permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  /**
   * Check if notifications are supported and permitted
   */
  isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  isGranted(): boolean {
    return this.permission === "granted";
  }

  /**
   * Show a notification immediately
   */
  async show(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) return void console.warn("This browser does not support notifications");
    if (!this.isGranted())
      if (!(await this.requestPermission())) return void console.warn("Notification permission not granted");
    try {
      const notificationPayload = {
        body: options.body,
        icon: options.icon || "/icons/icon-192x192.png",
        badge: options.badge || "/icons/icon-96x96.png",
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        vibrate: options.vibrate ?? [100, 50, 100],
      };
      // Preferred path: Service Worker notifications.
      if ("serviceWorker" in navigator)
        try {
          let registration =
            (await navigator.serviceWorker.getRegistration()) || (await navigator.serviceWorker.register("/sw.js"));
          registration = registration.active ? registration : await navigator.serviceWorker.ready;
          await registration.showNotification(options.title, notificationPayload as NotificationOptions);
          return;
        } catch (error) {
          console.warn("SW notification failed, falling back:", error);
        }
      new Notification(options.title, notificationPayload as NotificationOptions); // Last-resort fallback when SW notification path is unavailable.
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  /**
   * Schedule a daily reminder at a specific time
   */
  scheduleDailyReminder(habitId: string, habitTitle: string, habitIcon: string, time: string): void {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) scheduledTime.setDate(scheduledTime.getDate() + 1);
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    appState.scheduledReminders[habitId] = {
      habitTitle,
      habitIcon,
      time,
      nextScheduled: scheduledTime.toISOString(),
    };
    // Schedule the notification
    setTimeout(() => {
      this.show({
        title: `🎯 Time for ${habitIcon} ${habitTitle}!`,
        body: "Keep your streak alive!",
        tag: `habit-reminder-${habitId}`,
        data: { habitId, type: "daily-reminder" },
        requireInteraction: true,
      });
      // Reschedule for tomorrow
      this.scheduleDailyReminder(habitId, habitTitle, habitIcon, time);
    }, timeUntilNotification);
  }

  /**
   * Cancel a scheduled reminder
   */
  cancelReminder(habitId: string): void {
    delete appState.scheduledReminders[habitId];
  }

  /**
   * Restore scheduled reminders on app load
   */
  restoreScheduledReminders(habits: any[]): void {
    habits.forEach((habit) => {
      if (habit.reminderEnabled && habit.reminderTime && appState.scheduledReminders[habit.id])
        this.scheduleDailyReminder(habit.id, habit.title, habit.icon, habit.reminderTime);
    });
  }

  /**
   * Show streak milestone notification
   */
  showStreakMilestone(habitTitle: string, habitIcon: string, streak: number): void {
    let title = "";
    let body = "";
    if (streak === 7) {
      title = "🔥 One Week Strong!";
      body = `You've maintained ${habitIcon} ${habitTitle} for 7 days!`;
    } else if (streak === 30) {
      title = "🏆 Monthly Master!";
      body = `30 days of ${habitIcon} ${habitTitle}! You're unstoppable!`;
    } else if (streak === 100) {
      title = "💯 Century Club!";
      body = `100 days of ${habitIcon} ${habitTitle}! You're a legend!`;
    } else if (streak % 50 === 0 && streak > 0) {
      title = `🎉 ${streak} Day Streak!`;
      body = `Amazing consistency with ${habitIcon} ${habitTitle}!`;
    }
    if (title)
      this.show({
        title,
        body,
        tag: "streak-milestone",
        requireInteraction: true,
      });
  }

  /**
   * Show streak at risk notification
   */
  showStreakAtRisk(habitTitle: string, habitIcon: string, streak: number): void {
    this.show({
      title: "⚠️ Don't Break Your Streak!",
      body: `${habitIcon} ${habitTitle} streak of ${streak} days is at risk!`,
      tag: "streak-at-risk",
      requireInteraction: true,
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
