export interface Habit {
  id: string;
  title: string;
  icon: string;
  target: number;
  streak: number;
  history: string[];
  slug: string;
  startDate: string;
  trackingStartDate?: string;
}
