"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Dashboard.module.css";
import Greeting from "./Greeting";
import StatsOverview from "./StatsOverview";
import ActiveHabits from "./ActiveHabits";
import MotivationHub from "./MotivationHub";
import Heatmap from "./Heatmap";

const DashboardClient: React.FC = () => {
  return (
    <div className={styles.Dashboard_Wrapper}>
      <Greeting />

      <main className={styles.Dashboard_Main}>
        <MotivationHub />
        <StatsOverview />
        <Heatmap />
        <ActiveHabits />
      </main>
    </div>
  );
};

export default DashboardClient;
