"use client";

import React from "react";
import { motion } from "framer-motion";
import  {useOnboarding } from "@/context/onboarding/OnboardingContext";
import styles from "@/Styles/Onboarding/StepIndicator.module.css";

interface StepIndicatorProps {
  stepNames?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNames = ["Welcome", "Goal", "Habit", "Commit", "Done"],
}) => {
  const { currentStep, totalSteps } = useOnboarding();

  return (
    <div className={styles.StepIndicator}>
      {stepNames.map((name, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={name}>
            <div className={styles.Step}>
              <motion.div
                className={`${styles.StepDot} ${
                  isActive ? styles.Active : isCompleted ? styles.Completed : ""
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor:
                    isCompleted || isActive
                      ? "var(--color-brand-primary)"
                      : "var(--color-border-light)",
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={styles.Checkmark}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
              <span
                className={`${styles.StepLabel} ${isActive ? styles.Active : ""}`}
              >
                {name}
              </span>
            </div>
            {index < stepNames.length - 1 && (
              <div
                className={`${styles.StepLine} ${
                  index < currentStep ? styles.Completed : ""
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;