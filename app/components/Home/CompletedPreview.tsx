"use client";

import styles from "@/app/Styles/Home/CompletedPreview.module.css";
import Aos from "aos";
import { useEffect } from "react";
import ProgressTrack from "../ProgressTracker";


interface Habit {
  icon: string;
  title: string;
  streak: number;
  target: number;
}

const CompletedPreview: React.FC = () => {
  const habits : Habit[] = [
    { icon: "💧", title: "Drink Water", streak: 30, target: 30 },
    { icon: "📚", title: "Read Book", streak: 3, target: 30 },
    { icon: "🏃", title: "Exercise", streak: 5, target: 30 },
  ];

  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  return (
    <section className={styles.completedPreview}>
      <h2 className={styles.title}>Complete Habits Preview </h2>
      <div className={styles.habits} data-aos="fade-up" data-aos-delay="200">
        {habits.map((habit, index) => {
          const progress = Math.round((habit.streak / habit.target) * 100);
          return (
            <div key={index} className={styles.habit}>
              <div className={styles.icon}>{habit.icon}</div>
              <h3 className={styles.habitTitle}>{habit.title}</h3>
              <p className={styles.streak}>{habit.streak} days</p>
              <ProgressTrack radius={65} stroke={8} progress={progress} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CompletedPreview;
