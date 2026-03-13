"use client";
import styles from "@/app/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/app/components/Home/FeaturedHighlight";
import QuotesMotivation from "@/app/components/Home/QuotesMotivation";
import CompletedPreview from "@/app/components/Home/CompletedPreview";
import LottieAnimation from "@/app/components/Home/LottieAniamtion";
import { useRipple } from "@/app/Hooks/useRipple";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { trackHomeVisit } from "@/core/intent/homeIntent";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const createRipple = useRipple();
  const [isReturning, setIsReturning] = useState<boolean>(false);

  useEffect(() => {
    const returning = trackHomeVisit();
    setIsReturning(returning);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

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
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--btn-primary-bg) 0%, var(--status-success) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
              }}
            >
              HabitSpark
            </span>
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
