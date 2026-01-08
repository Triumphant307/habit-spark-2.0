"use client";
import styles from "@/app/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/app/components/Home/FeaturedHighlight";
import QuotesMotivation from "@/app/components/Home/QuotesMotivation";
import CompletedPreview from "@/app/components/Home/CompletedPreview";
import LottieAnimation from "@/app/components/Home/LottieAniamtion";
import { useRipple } from "@/app/Hooks/useRipple";
import Link from "next/link";
import { motion } from "framer-motion";

const Home = () => {
  const createRipple = useRipple();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <section className={styles.section}>
        <motion.div
          className={styles.home}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.home__title} variants={itemVariants}>
            Welcome to <br />
            <span
              style={{
                background: "linear-gradient(45deg, var(--btn-primary-bg), var(--status-success))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              HabitSpark
            </span>
          </motion.h1>
          <motion.p className={styles.home__description} variants={itemVariants}>
            Your journey to better habits starts here. Track your progress, get
            suggestions, and celebrate your achievements.
          </motion.p>
          <motion.div className={styles.home__cta} variants={itemVariants}>
            <Link href="/suggestion" className={styles.home__button_link}>
              <button
                onPointerDown={(e) => createRipple(e)}
                className={styles.home__button}
              >
                Get Started
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