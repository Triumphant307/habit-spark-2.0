"use client";

import React from "react";
import { motion } from "framer-motion";
import commStyles from "@/Styles/Onboarding/CommitmentStep.module.css";
import styles from "@/Styles/Onboarding/Onboarding.module.css";
import Button from "@/components/UI/Button";
import { useOnboarding } from "@/context/onboarding/OnboardingContext";
import { OnboardingFrequency } from "@/types/onboarding";
import { LuCalendarDays, LuCalendarRange, LuSettings2 } from "react-icons/lu";

const options: {
  type: OnboardingFrequency;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "Daily",
    label: "Every Day",
    desc: "Best for building strong consistency.",
    icon: <LuCalendarDays />,
  },
  {
    type: "Weekly",
    label: "Weekly Goal",
    desc: "For habits that happen a few times a week.",
    icon: <LuCalendarRange />,
  },
  {
    type: "Custom",
    label: "Flexible",
    desc: "I'll choose as I go.",
    icon: <LuSettings2 />,
  },
];

const CommitmentStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();

  const handleSelect = (frequency: OnboardingFrequency) => {
    updateFormData({ frequency });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <header className={styles.Header}>
        <h1 className={styles.Title}>The Commitment 🤝</h1>
        <p className={styles.Subtitle}>
          How often do you want to show up for this habit?
        </p>
      </header>

      <div className={commStyles.FrequencyGrid}>
        {options.map((opt) => (
          <button
            key={opt.type}
            type="button"
            className={`${commStyles.Option} ${
              formData.frequency === opt.type ? commStyles.ActiveOption : ""
            }`}
            onClick={() => handleSelect(opt.type)}
          >
            <div className={commStyles.OptionIcon}>{opt.icon}</div>
            <div className={commStyles.OptionText}>
              <span className={commStyles.OptionLabel}>{opt.label}</span>
              <span className={commStyles.OptionDescription}>{opt.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div
        className={styles.ActionGroup}
        style={{ marginTop: "var(--spacing-xl)" }}
      >
        <button className={styles.BackButton} onClick={prevStep}>
          Back
        </button>
        <Button onClick={nextStep} showIcon>
          Finalize
        </Button>
      </div>
    </motion.div>
  );
};

export default CommitmentStep;
