"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/UI/Button";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";
import { GOAL_OPTIONS, OnboardingGoal } from "@/types/onboarding";
import styles from "@/Styles/Onboarding/GoalStep.module.css";

export const GoalStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();

  const handleSelect = (goal: OnboardingGoal) => {
    const currentGoals = formData.goals;
    const isSelected = currentGoals.includes(goal);

    if (isSelected) {
      // Remove goal if already selected
      updateFormData({ goals: currentGoals.filter((g) => g !== goal) });
    } else {
      // Add goal if not selected
      updateFormData({ goals: [...currentGoals, goal] });
    }
  };

  const handleContinue = () => {
    if (formData.goals.length > 0) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.GoalStep}
    >
      <div className={styles.Header}>
        <h2 className={styles.Title}>What's your focus?</h2>
        <p className={styles.Subtitle}>
          Choose the areas you want to prioritize (Select all that apply)
        </p>
      </div>

      <div className={styles.GoalGrid}>
        {GOAL_OPTIONS.map((option, index) => (
          <motion.button
            key={option.value}
            className={`${styles.GoalCard} ${
              formData.goals.includes(option.value) ? styles.Selected : ""
            }`}
            onClick={() => handleSelect(option.value)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            <span className={styles.GoalIcon}>{option.icon}</span>
            <span className={styles.GoalLabel}>{option.label}</span>
          </motion.button>
        ))}
      </div>

      <div className={styles.Actions}>
        <Button onClick={prevStep} variant="secondary">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={formData.goals.length === 0}
          showIcon
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default GoalStep;
