import { appStore } from "./app";
import { fanout } from "sia-reactor/utils";
import quotes from "../../data/quotes.json";
import dayjs from "dayjs";

/**
 * Refreshes the daily motivation quote in the global state
 * @param force If true, ignores the daily check and updates anyway
 */
export const refreshMotivation = (force = false) => {
  const today = dayjs().format("YYYY-MM-DD");
  const lastUpdated = appStore.user.motivation.lastUpdated;
  if (lastUpdated !== today || force) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    fanout(appStore.user.motivation, { quote: selectedQuote.q, author: selectedQuote.a, lastUpdated: today });
    return true;
  }
  return false;
};
