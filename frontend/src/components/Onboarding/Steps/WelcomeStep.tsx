"use client";

import React from "react";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";
import { LuUser } from "react-icons/lu";
import styles from "@/Styles/Onboarding/Onboarding.module.css";

const WelcomeStep: React.FC = () => {
  const { formData, updateFormData, nextStep } = useOnboarding();

  const handleContinue = () => {
    if (formData.nickname.trim().length >= 2) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <header className={styles.Header}>
        <h1 className={styles.Title}>Welcome! 👋</h1>
        <p className={styles.Subtitle}>
          What should we call you? We'll use this to personalize your HabitSpark
          experience.
        </p>
      </header>

      <Input
        label="Your Nickname"
        value={formData.nickname}
        onChange={(e) => updateFormData({ nickname: e.target.value })}
        icon={<LuUser />}
        placeholder="e.g. Sparky"
      />

      <div style={{ marginTop: "var(--spacing-xl)" }}>
        <Button
          onClick={handleContinue}
          disabled={formData.nickname.trim().length < 2}
          showIcon
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeStep;
