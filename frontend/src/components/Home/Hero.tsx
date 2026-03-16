"use client";
import styles from "@/Styles/Home/Home.module.css";
import { trackHomeVisit } from "@/core/intent/homeIntent";
import { useRipple } from "@/Hooks/useRipple";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  containerVariants,
  badgeVariants,
  itemVariants,
} from "./HomeAnimations";
import {
  LuZap,
  LuTrendingUp,
  LuTarget,
  LuCloudSun,
  LuGift,
} from "react-icons/lu";

const Hero: React.FC = () => {
  const createRipple = useRipple();
  const [isReturning, setIsReturning] = useState<boolean>(false);

  useEffect(() => {
    const returning = trackHomeVisit();
    setIsReturning(returning);
  }, []);
  return (
    <>
      <motion.div
        className={styles.Home_Container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Badges */}
        <motion.div
          className={`${styles.Home_Badge} ${styles.Home_Badge1}`}
          custom={0}
          variants={badgeVariants}
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" as const,
            },
          }}
        >
          <LuZap /> Track Smart
        </motion.div>
        <motion.div
          className={`${styles.Home_Badge} ${styles.Home_Badge2}`}
          custom={1}
          variants={badgeVariants}
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut" as const,
            },
          }}
        >
          Grow Fast <LuTrendingUp />
        </motion.div>
        <motion.div
          className={`${styles.Home_Badge} ${styles.Home_Badge3}`}
          custom={2}
          variants={badgeVariants}
          animate={{
            y: [0, -8, 0],
            transition: {
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 1,
            },
          }}
        >
          <LuTarget /> Goal Driven
        </motion.div>
        <motion.div
          className={`${styles.Home_Badge} ${styles.Home_Badge4}`}
          custom={3}
          variants={badgeVariants}
          animate={{
            y: [0, 12, 0],
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 1.5,
            },
          }}
        >
          Cloud Sync <LuCloudSun />
        </motion.div>

        <motion.div
          className={`${styles.Home_Badge} ${styles.Home_Badge5}`}
          custom={4}
          variants={badgeVariants}
          animate={{
            y: [0, -6, 0],
            transition: {
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 2,
            },
          }}
        >
          100% Free <LuGift />
        </motion.div>

        <motion.h1 className={styles.Home_Title} variants={itemVariants}>
          Welcome to {isReturning ? "Back" : ""} <br />
          <span className={styles.Home_TitleAccent}>HabitSpark</span>
        </motion.h1>
        <motion.p className={styles.Home_Description} variants={itemVariants}>
          {isReturning
            ? "We are glad to see you again! Your consistency is paying off."
            : "Turn your goals into measurable achievements. Visualize your consistency, analyze your progress, and stay motivated with HabitSpark."}
        </motion.p>
        <motion.div className={styles.Home_CTA} variants={itemVariants}>
          <Link href="/suggestion" className={styles.home__button_link}>
            <button
              onPointerDown={(e) => createRipple(e)}
              className={styles.Home_HeroButton}
            >
              {isReturning ? "Sign Up - It's Free!" : "Sign Up - It's Free!"}
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Hero;
