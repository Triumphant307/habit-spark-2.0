"use client";
import styles from "@/Styles/Pages/Completed.module.css";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FaHardHat, FaTools, FaTrafficLight } from "react-icons/fa";

const Completed: React.FC = () => {
  const iconVariants: Variants = {
    float: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className={styles.Completed_Wrapper}>
      {/* Ambient Background Blobs */}
      <div className={`${styles.Completed_Blob} ${styles.Completed_Blob1}`} />
      <div className={`${styles.Completed_Blob} ${styles.Completed_Blob2}`} />

      <motion.div
        className={styles.Completed_Card}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.Completed_IconWrapper}>
          <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "0s" }}>
            <FaHardHat />
          </motion.div>
          <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "1s" }}>
            <FaTools
              style={{
                fontSize: "2.5rem",
                color: "var(--color-text-secondary)",
              }}
            />
          </motion.div>
          <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "0.5s" }}>
            <FaTrafficLight style={{ color: "var(--color-status-error)" }} />
          </motion.div>
        </div>

        <h1 className={styles.Completed_Title}>Under Construction</h1>

        <p className={styles.Completed_Description}>
          We're working hard to build a place for your completed achievements.
          <br />
          Check back soon for the grand opening! 🚀
        </p>

        <Link href="/" className={styles.Completed_BackButton}>
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Completed;
