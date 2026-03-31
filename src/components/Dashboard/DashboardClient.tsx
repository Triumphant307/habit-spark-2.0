"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Dashboard.module.css";
import Greeting from "./Greeting";
import StatsOverview from "./StatsOverview";
import ActiveHabits from "./ActiveHabits";

const DashboardClient: React.FC = () => {
  return (
    <div className={styles.Dashboard_Wrapper}>
      <Greeting />

      <main className={styles.Dashboard_Main}>
        <StatsOverview />
        <ActiveHabits />
      </main>
    </div>
  );
};

export default DashboardClient;
