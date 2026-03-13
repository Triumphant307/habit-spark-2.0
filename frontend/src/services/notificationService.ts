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
    if (typeof window !== "undefined" && "Notification" in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

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
    if (!this.isGranted()) {
      console.warn("Notification permission not granted");
      return;
    }

    try {
      // If service worker is available, use it
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || "/icons/icon-192x192.png",
          badge: options.badge || "/icons/icon-96x96.png",
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction,
          vibrate: [100, 50, 100],
        } as any);
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || "/icons/icon-192x192.png",
          tag: options.tag,
          data: options.data,
        });
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  /**
   * Schedule a daily reminder at a specific time
   */
  scheduleDailyReminder(
    habitId: string,
    habitTitle: string,
    habitIcon: string,
    time: string,
  ): void {
    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Store in localStorage for persistence
    const reminders = this.getScheduledReminders();
    reminders[habitId] = {
      habitTitle,
      habitIcon,
      time,
      nextScheduled: scheduledTime.toISOString(),
    };
    localStorage.setItem("scheduledReminders", JSON.stringify(reminders));

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
    const reminders = this.getScheduledReminders();
    delete reminders[habitId];
    localStorage.setItem("scheduledReminders", JSON.stringify(reminders));
  }

  /**
   * Get all scheduled reminders
   */
  private getScheduledReminders(): Record<string, any> {
    try {
      const stored = localStorage.getItem("scheduledReminders");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Restore scheduled reminders on app load
   */
  restoreScheduledReminders(habits: any[]): void {
    const reminders = this.getScheduledReminders();

    habits.forEach((habit) => {
      if (habit.reminderEnabled && habit.reminderTime && reminders[habit.id]) {
        this.scheduleDailyReminder(
          habit.id,
          habit.title,
          habit.icon,
          habit.reminderTime,
        );
      }
    });
  }

  /**
   * Show streak milestone notification
   */
  showStreakMilestone(
    habitTitle: string,
    habitIcon: string,
    streak: number,
  ): void {
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

    if (title) {
      this.show({
        title,
        body,
        tag: "streak-milestone",
        requireInteraction: true,
      });
    }
  }

  /**
   * Show streak at risk notification
   */
  showStreakAtRisk(
    habitTitle: string,
    habitIcon: string,
    streak: number,
  ): void {
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
