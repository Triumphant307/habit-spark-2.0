"use client";
import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import styles from "@/Styles/Suggestion/SuggestionForm.module.css";
import { useRipple } from "@/Hooks/useRipple";
import toast from "@/utils/toast";
import logger from "@/utils/logger";
import { addHabitIntent } from "@/core/intent/habitIntents";
import Link from "next/link";
import { FaSmile, FaExclamationCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const SuggestionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const createRipple = useRipple();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleEmojiSelect = (emoji: { native: string }) => {
    setIcon(emoji.native);
    setShowPicker(false);
  };

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    // Validate title
    if (!trimmedTitle) {
      setError("Please enter a habit title.");
      return;
    }
    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }

    // Validate icon
    if (!icon) {
      setError("Please select an icon for your habit.");
      return;
    }

    // Validate target
    if (target < 1) {
      setError("Target must be at least 1 day.");
      return;
    }

    // Uses Intent from the reactor core
    logger.info("Creating new habit", { title: trimmedTitle, icon, target });
    addHabitIntent({
      title: title.trim(),
      icon,
      target,
      streak: 0,
      history: [],
    });

    toast.dismiss();
    toast.success(
      <span>
        {`${title.trim()} ${icon} added to your habits!`}
        <Link
          href="/tracker"
          style={{ color: "#4caf50", textDecoration: "underline" }}
        >
          Go to Tracker
        </Link>
      </span>,
    );

    // Reset form fields after adding habit
    setTitle("");
    setIcon("");
    setTarget(30);
    setError("");
    setShowPicker(false);
  };

  return (
    <form
      onSubmit={handleAddHabit}
      className={styles.SuggestionForm_Container}
      noValidate
      aria-label="Add new habit"
      id="suggestion-form"
    >
      <div className={styles.SuggestionForm_FloatingInput}>
        <input
          id="habit-title"
          name="habit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=" "
          autoComplete="off"
          maxLength={50}
          minLength={3}
          required
          spellCheck="false"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "form-error" : undefined}
        />
        <label htmlFor="habit-title">What's the habit name?</label>
      </div>

      <div className={styles.SuggestionForm_PickerContainer}>
        <label
          htmlFor="habit-icon"
          className={styles.SuggestionForm_InputLabel}
        >
          Pick a representative icon
        </label>
        <button
          id="habit-icon"
          className={styles.SuggestionForm_IconPreview}
          onPointerDown={(e) => createRipple(e)}
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          title={icon ? `Selected: ${icon}` : "Choose Habit Icon"}
          aria-label={
            icon
              ? `Selected emoji: ${icon}. Click to change`
              : "Choose an emoji icon for your habit"
          }
          aria-expanded={showPicker}
        >
          {icon ? (
            <span className={styles.SuggestionForm_SelectedEmoji}>{icon}</span>
          ) : (
            <div className={styles.SuggestionForm_PlaceholderIcon}>
              <FaSmile />
              <small>Select</small>
            </div>
          )}
        </button>
        <AnimatePresence>
          {showPicker && (
            <motion.div
              className={styles.SuggestionForm_PickerWrapper}
              ref={pickerRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.SuggestionForm_FloatingInput}>
        <input
          id="habit-target"
          name="habit-target"
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          placeholder=" "
          aria-label="Habit target in days"
          autoComplete="off"
          required
          min={1}
          max={365}
          aria-required="true"
        />

        <label htmlFor="habit-target">Goal (days)</label>
      </div>

      <button
        className={styles.SuggestionForm_SubmitButton}
        onPointerDown={(e) => createRipple(e)}
        type="submit"
        title="Add new Habits"
        aria-label="Add new habit to your tracker"
      >
        Build Habit
      </button>

      {error && (
        <div
          id="form-error"
          className={styles.SuggestionForm_Error}
          role="alert"
        >
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};

export default SuggestionForm;
