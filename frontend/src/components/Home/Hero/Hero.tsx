"use client";
import styles from "@/app/Home.module.css";
import { trackHomeVisit } from "@/core/store/home";
import { rippleHandler } from "@t007/utils/hooks/vanilla";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { containerVariants, badgeVariants, itemVariants } from ".././HomeAnimations";

const Hero: React.FC = () => {
  const [isReturning, setIsReturning] = useState<boolean>(false);

  useEffect(() => {
    const returning = trackHomeVisit();
    setIsReturning(returning);
  }, []);
  return (
    <>
      <motion.div className={styles.Hero_section} variants={containerVariants} initial="hidden" animate="visible">
      

        <motion.h1 className={styles.Home_Title} variants={itemVariants}>
          Build Better Habits, <br className={styles.DesktopBreak} /> Live Better Life
        </motion.h1>
        <motion.p className={styles.Home_Description} variants={itemVariants}>
         HabitSpark is a simple tracker that makes your consistency visible at a glance.
        </motion.p>
        <motion.div className={styles.Home_CTA} variants={itemVariants}>
          <Link href="/signup" className={styles.home__button_link}>
            <button onPointerDown={rippleHandler} className={styles.Home_HeroButton}>
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Hero;
