"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/Styles/Dashboard/QuickAddModal.module.css";
import { useRipple } from "@/Hooks/useRipple";
import Input from "@/components/UI/Input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { LuPlus, LuX, LuSmile } from "react-icons/lu";
import { FaExclamationCircle } from "react-icons/fa";
import { addHabit } from "@/core/state/habits";
import toast from "@/utils/toast";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(30);
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const createRipple = useRipple();

  // Sync dialog open/close state with the native <dialog> element
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset form fields whenever the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setTarget(30);
      setIcon("");
      setError("");
      setShowPicker(false);
    }
  }, [isOpen]);

  // Close emoji picker on outside click
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!icon) {
      setError("Please select an emoji icon.");
      return;
    }
    if (target < 1 || target > 365) {
      setError("Streak target must be between 1 and 365 days.");
      return;
    }

    addHabit({ title: trimmedTitle, icon, target });

    toast.success(`"${trimmedTitle}" habit created! 🎉`);
    onClose();
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setIcon(emoji.native);
    setShowPicker(false);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.QAModal_Container}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="qa-modal-title"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit} className={styles.QAModal_Form}>
              <h2 id="qa-modal-title" className={styles.QAModal_Title}>
                <LuPlus className={styles.QAModal_TitleIcon} />
                New Habit
              </h2>

              {/* Title input — uses shared Input component */}
              <Input
                label="Habit Title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                autoFocus
                maxLength={60}
              />

              {/* Target input — uses shared Input component */}
              <Input
                label="Streak Target (days)"
                type="number"
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  setError("");
                }}
                min={1}
                max={365}
              />

              {/* Emoji icon picker */}
              <div className={styles.QAModal_PickerContainer}>
                <label htmlFor="qa-icon" className={styles.QAModal_InputLabel}>
                  Habit Icon
                </label>
                <button
                  id="qa-icon"
                  type="button"
                  className={styles.QAModal_IconPreview}
                  onClick={() => setShowPicker(!showPicker)}
                  onPointerDown={(e) => createRipple(e)}
                  aria-label={
                    icon
                      ? `Selected emoji: ${icon}. Click to change`
                      : "Choose an emoji icon for your habit"
                  }
                  aria-expanded={showPicker}
                  title={icon ? `Selected: ${icon}` : "Choose Icon"}
                >
                  {icon ? (
                    <span className={styles.QAModal_SelectedEmoji}>{icon}</span>
                  ) : (
                    <div className={styles.QAModal_PlaceholderIcon}>
                      <LuSmile />
                      <small>Pick Icon</small>
                    </div>
                  )}
                </button>

                {showPicker && (
                  <div className={styles.QAModal_PickerWrapper} ref={pickerRef}>
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </div>

              {/* Inline validation error */}
              {error && (
                <div
                  id="qa-modal-error"
                  className={styles.QAModal_Error}
                  role="alert"
                >
                  <FaExclamationCircle />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className={styles.QAModal_Actions}>
                <button
                  type="button"
                  className={styles.QAModal_CancelButton}
                  onClick={onClose}
                  onPointerDown={(e) => createRipple(e)}
                  aria-label="Cancel and close dialog"
                >
                  <LuX /> Cancel
                </button>
                <button
                  type="submit"
                  className={styles.QAModal_SaveButton}
                  onPointerDown={(e) => createRipple(e)}
                  aria-label="Create habit"
                >
                  <LuPlus /> Create Habit
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};

export default QuickAddModal;
