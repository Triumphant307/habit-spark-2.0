"use client";

import React from "react";
import styles from "@/Styles/Onboarding/Onboarding.module.css";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "./UI/StepIndicator";
import WelcomeStep from "./Steps/WelcomeStep";
import GoalStep from "./Steps/GoalStep";
import FirstHabitStep from "./Steps/FirstHabitStep";
import CommitmentStep from "./Steps/CommitmentStep";
import SuccessStep from "./Steps/SuccessStep";

const OnboardingContent: React.FC = () => {
  const { currentStep } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <GoalStep />;
      case 3:
        return <FirstHabitStep />;
      case 4:
        return <CommitmentStep />;
      case 5:
        return <SuccessStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <main className={styles.Layout}>
      <div className={styles.Card}>
        {/* Progress Indicator */}
        {currentStep < 5 && <StepIndicator />}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default OnboardingContent;
