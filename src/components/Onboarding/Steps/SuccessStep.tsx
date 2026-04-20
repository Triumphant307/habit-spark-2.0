"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "@/Styles/Onboarding/Onboarding.module.css";
import successStyles from "@/Styles/Onboarding/SuccessStep.module.css";
import { LuPartyPopper, LuSparkles } from "react-icons/lu";
import Button from "@/components/UI/Button";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";

const SuccessStep: React.FC = () => {
  const { formData, handleComplete } = useOnboarding();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={successStyles.SuccessContent}
    >
      <div className={successStyles.SuccessIcon}>
        <LuPartyPopper />
      </div>

      <header className={styles.Header}>
        <h1 className={styles.Title}>You're all set, {formData.nickname}!</h1>
        <p className={styles.Subtitle}>Your first spark is ready to be ignited. Let's make it a habit.</p>
      </header>

      <div className={successStyles.Summary}>
        <span className={successStyles.SummaryTitle}>Your First Habit</span>
        <div className={successStyles.SummaryHabit}>
          <LuSparkles style={{ marginRight: "8px" }} />
          {formData.firstHabit}
        </div>
      </div>

      <Button onClick={handleComplete} style={{ width: "100%", marginTop: "var(--spacing-xl)" }} showIcon>
        Go to Dashboard
      </Button>
    </motion.div>
  );
};

export default SuccessStep;
