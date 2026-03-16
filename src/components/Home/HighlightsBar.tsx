"use client";
import React from "react";
import styles from "@/Styles/Home/HighlightsBar.module.css";
import { motion } from "framer-motion";

const HighlightsBar: React.FC = () => {
  const highlights = [
    "Secure Cloud Sync",
    "No-Card Required",
    "Open Source",
    "Cross-Platform",
    "Smart Analytics",
    "Privacy First",
    "Custom Themes",
  ];

  // Duplicate for seamless infinite scrolling
  const duplicatedHighlights = [...highlights, ...highlights];

  return (
    <div className={styles.HighlightsContainer}>
      <div className={styles.HighlightsContent}>
        <motion.div
          className={styles.CarouselTrack}
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35, // Adjust for desired speed
              ease: "linear",
            },
          }}
        >
          {duplicatedHighlights.map((item, index) => (
            <div key={index} className={styles.HighlightItemWrapper}>
              <span className={styles.HighlightItem}>{item}</span>
              <span className={styles.HighlightSeparator}>•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HighlightsBar;
