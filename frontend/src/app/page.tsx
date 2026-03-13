"use client";
import styles from "@/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/components/Home/FeaturedHighlight";
import QuotesMotivation from "@/components/Home/QuotesMotivation";
import CompletedPreview from "@/components/Home/CompletedPreview";
import LottieAnimation from "@/components/Home/LottieAniamtion";
import { useRipple } from "@/Hooks/useRipple";
import Link from "next/link";
import { motion } from "framer-motion";
import { trackHomeVisit } from "@/core/intent/homeIntent";
import { useEffect, useState } from "react";

import {
  containerVariants,
  itemVariants,
  fadeInUpVariants,
  badgeVariants,
} from "@/components/Home/HomeAnimations";

const Home: React.FC = () => {
  const createRipple = useRipple();
  const [isReturning, setIsReturning] = useState<boolean>(false);

  useEffect(() => {
    const returning = trackHomeVisit();
    setIsReturning(returning);
  }, []);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.hero__bg} />

        <motion.div
          className={styles.home}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating Badges */}
          <motion.div
            className={`${styles.badge} ${styles.badge__1}`}
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
            ✨ Track Smart
          </motion.div>
          <motion.div
            className={`${styles.badge} ${styles.badge__2}`}
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
            Grow Fast 📈
          </motion.div>
          <motion.div
            className={`${styles.badge} ${styles.badge__3}`}
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
            🎯 Goal Driven
          </motion.div>

          <motion.h1 className={styles.home__title} variants={itemVariants}>
            Welcome to {isReturning ? "Back" : ""} <br />
            <span className={styles.home__titleSpan}>HabitSpark</span>
          </motion.h1>
          <motion.p
            className={styles.home__description}
            variants={itemVariants}
          >
            {isReturning
              ? "We are glad to see you again! Your consistency is paying off."
              : "Your journey to better habits starts here. Track your progress, get suggestions, and celebrate your achievements."}
          </motion.p>
          <motion.div className={styles.home__cta} variants={itemVariants}>
            <Link href="/suggestion" className={styles.home__button_link}>
              <button
                onPointerDown={(e) => createRipple(e)}
                className={styles.home__button}
              >
                {/* Get Started */}
                {isReturning ? "Continue" : "Explore Now"}
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <FeaturedHighlight />
        </motion.div>

        <motion.div
          style={{ textAlign: "center", padding: "2rem" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <h2 className={styles.h2}>Stay Consistent, Stay Motivated</h2>
          <p className={styles.p}>
            Join us in building better habits and achieving your goals.
          </p>
          <LottieAnimation />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <QuotesMotivation />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <CompletedPreview />
        </motion.div>
      </section>
    </>
  );
};

export default Home;
