import { appState } from "../state/state";

interface Habit {
  title: string;
  icon: string;
  target: number;
  streak: number;
  history: any[];
}

export const addHabitIntent = (habit: Habit) => {
  try {
    appState.set("habits", [...appState.get("habits") ?? [], habit]);
    console.log(appState.get("habits"));
  } catch (e) {
    console.error("Failed to add habit", e);
  }
};
