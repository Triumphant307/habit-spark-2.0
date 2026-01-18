export interface Habit {
  id: number;
  title: string;
  icon: string;
  target: number;
  streak: number;
  history: string[];
  startDate: string;
}