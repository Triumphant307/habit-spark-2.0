"use client";

import React, { createContext, useContext, useState } from "react";
import { OnboardingData, OnboardingStep } from "@/types/onboarding";
import { useRouter } from "next/navigation";

interface OnboardingContextType {
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  handleComplete: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState<OnboardingData>({
    nickname: "",
    goals: [],
    firstHabit: "",
    frequency: "Daily",
  });

  const nextStep = () => setStep((prev) => (prev < totalSteps ? (prev + 1) as OnboardingStep : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? (prev - 1) as OnboardingStep : prev));

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = async () => {
    console.log("Onboarding Complete:", formData);
    // Integration point for database/backend
    router.push("/tracker");
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        currentStep: step, 
        totalSteps, 
        nextStep, 
        prevStep, 
        handleComplete 
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
