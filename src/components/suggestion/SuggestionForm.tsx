"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/Styles/Suggestion/SuggestionForm.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import toast from "@/app/utils/toast";
import logger from "@/app/utils/logger";
import { addHabitIntent } from "@/core/intent/habitIntents";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Link from "next/link";
import { FaSmile, FaExclamationCircle } from "react-icons/fa";

interface Emoji {
  native: string;
  [key: string]: unknown;
}

const SuggestionForm = () => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [target, setTarget] = useState(30);
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

  const handleEmojiSelect = (emoji: Emoji) => {
    setIcon(emoji.native); // Set the selected emoji as the icon
    setShowPicker(false); // Optionally close the picker
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
      className={styles.form}
      noValidate
      aria-label="Add new habit"
      id="suggestion-form"
    >
      <div className={styles.floatingInput}>
        <input
          id="habit-title"
          name="habit-title"
          className={styles.TitleInput}
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
        <label htmlFor="habit-title">Habit Title</label>
      </div>

      <div className={styles.pickerContainer}>
        <label htmlFor="habit-icon" className={styles.inputLabel}>
          Habit Icon
        </label>
        <button
          id="habit-icon"
          className={styles.iconPreviewBtn}
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
            <span className={styles.selectedEmoji}>{icon}</span>
          ) : (
            <div className={styles.placeholderIcon}>
              <FaSmile />
              <small>Add Icon</small>
            </div>
          )}
        </button>
        {showPicker && (
          <div className={styles.pickerWrapper} ref={pickerRef}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      <div className={styles.floatingInput}>
        <input
          id="habit-target"
          name="habit-target"
          className={styles.TargetInput}
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

        <label htmlFor="habit-target">Habit Target</label>
      </div>

      <button
        className={styles.btn}
        onPointerDown={(e) => createRipple(e)}
        type="submit"
        title="Add new Habits"
        aria-label="Add new habit to your tracker"
      >
        Add New Habit
      </button>
      {error && (
        <div id="form-error" className={styles.error} role="alert">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};

export default SuggestionForm;
