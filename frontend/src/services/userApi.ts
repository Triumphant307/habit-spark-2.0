import api from "./api";

interface OnboardingPayload {
  nickname: string;
  goal: string;
  commitment: string;
  firstHabit: {
    title: string;
    target: number;
    icon: string;
    category: string;
  };
}

export const onboardingApi = async (data: OnboardingPayload): Promise<void> => {
  await api.post("/user/onboarding", data);
};
