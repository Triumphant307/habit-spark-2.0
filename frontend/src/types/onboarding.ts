export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type OnboardingGoal =
  | "Health"
  | "Productivity"
  | "Mindfulness"
  | "Growth"
  | "Other"
  | "health"
  | "learning"
  | "fitness"
  | "creativity";

export type OnboardingFrequency = "Daily" | "Weekly" | "Custom" | "daily" | "weekdays";

export interface OnboardingData {
  /** User's name/nickname */
  nickname: string;
  /** Main focus areas */
  goals: OnboardingGoal[];
  /** First habit name */
  firstHabit: string;
  /** Commitment frequency */
  frequency: OnboardingFrequency;
}

export const GOAL_OPTIONS: { value: OnboardingGoal; label: string; icon: string }[] = [
  { value: "Health", label: "Health & Wellness", icon: "🍎" },
  { value: "Productivity", label: "Productivity", icon: "📈" },
  { value: "Mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "Growth", label: "Growth", icon: "🚀" },
  { value: "Other", label: "Other", icon: "✨" },
];

export const SUGGESTED_HABITS: Record<string, { title: string; icon: string }[]> = {
  Health: [
    { title: "Drink 8 glasses of water", icon: "💧" },
    { title: "Eat a healthy breakfast", icon: "🥣" },
    { title: "Take vitamins", icon: "💊" },
  ],
  Productivity: [
    { title: "Plan my day", icon: "📝" },
    { title: "Deep work session", icon: "🎯" },
    { title: "Inbox zero", icon: "📧" },
  ],
  Mindfulness: [
    { title: "Meditate for 10 minutes", icon: "🧘" },
    { title: "Journaling", icon: "📔" },
    { title: "Gratitude practice", icon: "🙏" },
  ],
};
