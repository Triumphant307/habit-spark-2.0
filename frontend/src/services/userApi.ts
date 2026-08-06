import api from "./api";

interface OnboardingPayload {
  goal: string;
  commitment: string;
  firstHabit: {
    title: string;
    target: number;
    icon: string;
  };
}

export const onboardingApi = async (data: OnboardingPayload): Promise<void> => {
  await api.post("/user/onboarding", data);
};
