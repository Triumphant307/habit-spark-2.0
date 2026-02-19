import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/app/Styles/Tracker/EditDialog.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FaCheck, FaTimes, FaEdit, FaSmile } from "react-icons/fa";

interface Habit {
  title: string;
  target: number;
  icon: string;
}

interface EditDialogProps {
  isOpen: boolean;
  habit: Habit;
  onClose: () => void;
  onSave: (updateHabit: Habit) => void;
}
const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  habit,
  onClose,
  onSave,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const createRipple = useRipple();

  useEffect(() => {
    if (isOpen && dialogRef?.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!habit) return;
    setTitle(habit.title);
    setTarget(habit.target);
    setIcon(habit.icon);
  }, [habit]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "" || icon.trim() === "") {
      setError("Please enter a title and select an icon.");
      return;
    } else if (title.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    } else if (icon.length < 1) {
      setError("Please select an icon.");
      return;
    } else if (target < 1) {
      setError("Target must be at least 1.");
      return;
    }
    onSave({
      ...habit,
      title,
      target: Number(target),
      icon,
    });
    onClose();
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setIcon(emoji.native); // Set the selected emoji as the icon
    setShowPicker(false); // Optionally close the picker
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(Number(e.target.value));
  };

  return (
    <>
      <dialog
        className={styles.EditDialog}
        onClose={onClose}
        onCancel={onClose}
        ref={dialogRef}
        aria-labelledby="edit-dialog-title"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form onSubmit={handleSubmit} className={styles.dialogForm}>
                <h2 id="edit-dialog-title" className={styles.dialogTitle}>
                  <FaEdit className={styles.titleIcon} /> Edit Habit
                </h2>

                <div className={styles.floatingInput}>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder=" "
                    autoFocus
                  />
                  <label htmlFor="title">Habit Title</label>
                </div>

                <div className={styles.floatingInput}>
                  <input
                    id="target"
                    type="number"
                    value={target}
                    onChange={handleChange}
                    min={1}
                    required
                    placeholder=" "
                    className={styles.inputs}
                  />
                  <label htmlFor="target">Habit Target:</label>
                </div>

                <div className={styles.pickerContainer}>
                  <label
                    htmlFor="edit-habit-icon"
                    className={styles.inputLabel}
                  >
                    Habit Icon
                  </label>
                  <button
                    id="edit-habit-icon"
                    className={styles.iconPreviewBtn}
                    type="button"
                    onPointerDown={(e) => createRipple(e)}
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
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.dialogAction}>
                  <button
                    type="button"
                    onClick={onClose}
                    onPointerDown={(e) => createRipple(e)}
                    title="Cancel Edit"
                    aria-label="Cancel editing and close dialog"
                    className={styles.cancelBtn}
                  >
                    <FaTimes /> Cancel
                  </button>

                  <button
                    onPointerDown={(e) => createRipple(e)}
                    type="submit"
                    title="Save Edit"
                    aria-label="Save changes to habit"
                    className={styles.saveBtn}
                  >
                    <FaCheck /> Save
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
};

export default EditDialog;
