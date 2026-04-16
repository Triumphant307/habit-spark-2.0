"use client";

import { useState } from "react";
import styles from "@/Styles/Suggestion/Suggestion.module.css";
import SuggestionCard from "@/components/Suggestion/SuggestionCard";
import QuickAddModal from "@/components/Dashboard/QuickAddModal";
import { LuPlus, LuSparkles } from "react-icons/lu";

const Suggestions = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className={styles.Suggestion_Container}>
      <h1 className={styles.Suggestion_Title}>Browse &amp; Discover Habits</h1>

      {/* CTA banner — opens QuickAddModal instead of a separate form */}
      <div className={styles.Suggestion_CTA}>
        <div className={styles.Suggestion_CTA_Text}>
          <LuSparkles className={styles.Suggestion_CTA_Icon} />
          <span>Don&apos;t see what you&apos;re looking for?</span>
        </div>
        <button
          className={styles.Suggestion_CTA_Button}
          onClick={() => setIsQuickAddOpen(true)}
          aria-label="Create a custom habit"
        >
          <LuPlus />
          Create Custom Habit
        </button>
      </div>

      <SuggestionCard />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};

export default Suggestions;
