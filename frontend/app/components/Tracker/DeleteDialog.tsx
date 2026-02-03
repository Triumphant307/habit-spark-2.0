import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/app/Styles/Tracker/DeleteDialog.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

interface DeleteDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MotionDialog = motion.dialog;

const DeleteDialog: React.FC<DeleteDialogProp> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createRipple = useRipple();

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDialog
          className={styles.dialog}
          ref={dialogRef}
          onClose={onClose}
          onCancel={onClose}
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="alertdialog"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <div className={styles.warningHeader}>
            <FaExclamationTriangle className={styles.warningIcon} />
            <h2 id="delete-dialog-title">Delete Habit</h2>
          </div>
          <p id="delete-dialog-description">
            Are you sure you want to delete this habit? This action cannot be
            undone.
          </p>
          <div className={styles.dialogActions}>
            <button
              autoFocus
              onClick={onClose}
              onPointerDown={(e) => createRipple(e)}
              className={styles.cancelBtn}
              title="Cancel habit"
              aria-label="Cancel and close dialog"
            >
              <FaTimes /> Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onPointerDown={(e) => createRipple(e)}
              onClick={onConfirm}
              title="Delete habit"
              aria-label="Confirm delete habit"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </MotionDialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
