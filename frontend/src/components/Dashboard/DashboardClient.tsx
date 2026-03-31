"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Dashboard.module.css";
import { motion } from "framer-motion";
import Greeting from "./Greeting";
import StatsOverview from "./StatsOverview";
import ActiveHabits from "./ActiveHabits";

const DashboardClient: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className={styles.Dashboard_Wrapper}>
      {/* Semantic Header for Greeting */}
      <header className={styles.Dashboard_Header}>
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <Greeting />
        </motion.div>
      </header>

      {/* Main Content for Stats and Habits */}
      <main className={styles.Dashboard_Main}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div variants={itemVariants}>
            <StatsOverview />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ActiveHabits />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardClient;
