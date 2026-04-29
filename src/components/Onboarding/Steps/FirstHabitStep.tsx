"use client";

import React from "react";
import { motion } from "framer-motion";
import chipStyles from "@/Styles/Onboarding/HabitStep.module.css";
import styles from "@/Styles/Onboarding/Onboarding.module.css";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";
import { LuSparkle } from "react-icons/lu";

const suggestions = [
  "Drink 2L Water",
  "Morning Walk",
  "Meditation (10m)",
  "Read 10 Pages",
  "No Sugar",
  "Plan My Day",
  "Gratefulness Journal",
];

const FirstHabitStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();

  const handleContinue = () => {
    if (formData.firstHabit.trim().length >= 2) {
      nextStep();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>Start Your Spark ✨</h1>
        <p className={styles.Subtitle}>Let's set your first habit. Pick a suggestion or create your own.</p>
      </header>

      <Input
        label="Enter Habit Name"
        value={formData.firstHabit}
        onChange={(e) => updateFormData({ firstHabit: e.target.value })}
        icon={<LuSparkle />}
        placeholder="e.g. Read for 15 mins"
        minLength={3}
      />

      <div className={chipStyles.ChipGroup}>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className={`${chipStyles.Chip} ${formData.firstHabit === s ? chipStyles.ActiveChip : ""}`}
            onClick={() => updateFormData({ firstHabit: s })}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={styles.ActionGroup} style={{ marginTop: "var(--spacing-xl)" }}>
        <button className={styles.BackButton} onClick={prevStep}>
          Back
        </button>
        <Button onClick={handleContinue} disabled={formData.firstHabit.trim().length < 2} showIcon>
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default FirstHabitStep;
