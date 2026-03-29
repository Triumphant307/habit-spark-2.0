"use client";

import React from "react";
import { OnboardingProvider } from "@/context/onboarding/OnboardingContext";
import OnboardingContent from "./OnboardingContent";

const OnboardingContainer: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default OnboardingContainer;
