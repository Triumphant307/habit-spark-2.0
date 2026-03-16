"use client";
import styles from "@/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/components/Home/FeaturedHighlight";
import QuotesMotivation from "@/components/Home/QuotesMotivation";
import CompletedPreview from "@/components/Home/CompletedPreview";
import LottieAnimation from "@/components/Home/LottieAniamtion";
import { motion } from "framer-motion";
import Hero from "@/components/Home/Hero";
import HighlightsBar from "@/components/Home/HighlightsBar";
import MotivationSection from "@/components/Home/MotivationSection";
import { fadeInUpVariants } from "@/components/Home/HomeAnimations";

const Home: React.FC = () => {
  return (
    <>
      <section className={styles.Home_Section}>
        <div className={styles.Home_Background} />

        <Hero />
        <HighlightsBar />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <FeaturedHighlight />
        </motion.div>

        <MotivationSection />

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
