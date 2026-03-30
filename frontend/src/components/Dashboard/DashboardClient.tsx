"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Dashboard.module.css";
import { motion } from "framer-motion";
import Greeting from "./Greeting";
import StatsOverview from "./StatsOverview";
import ActiveHabits from "./ActiveHabits";

const DashboardClient: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={styles.Dashboard_Wrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Greeting />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatsOverview />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ActiveHabits />
      </motion.div>
    </motion.div>
  );
};

export default DashboardClient;
