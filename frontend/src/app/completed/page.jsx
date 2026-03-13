"use client";
import styles from "../Styles/Completed.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHardHat, FaTools, FaTrafficLight } from "react-icons/fa";

const Completed = () => {
  const iconVariants = {
    float: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={styles.wrapper}>
      {/* Ambient Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.iconWrapper}>
          <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "0s" }}>
            <FaHardHat />
          </motion.div>
          <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "1s" }}>
             <FaTools style={{ fontSize: "2.5rem", color: "var(--text-secondary)" }} />
          </motion.div>
           <motion.div variants={iconVariants} animate="float" style={{ animationDelay: "0.5s" }}>
            <FaTrafficLight style={{ color: "var(--status-error)" }} />
          </motion.div>
        </div>

        <h1 className={styles.title}>Under Construction</h1>

        <p className={styles.description}>
          We're working hard to build a place for your completed achievements.
          <br />
          Check back soon for the grand opening! 🚀
        </p>

        <Link href="/" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Completed;