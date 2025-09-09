import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/app/Styles/Tracker/DeleteDialog.module.css";
import { useRipple } from "@/app/Hooks/useRipple";

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
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h2>Delete Habit</h2>
          <p>
            Are you sure you want to delete this habit? This action cannot be
            undone.
          </p>
          <div className={styles.dialogActions}>
            <button
              onClick={onClose}
              onPointerDown={(e) => createRipple(e)}
              className={styles.cancelBtn}
              title="Cancel habit"
            >
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onPointerDown={(e) => createRipple(e)}
              onClick={onConfirm}
              title="Delete habit"
            >
              Delete
            </button>
          </div>
        </MotionDialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
