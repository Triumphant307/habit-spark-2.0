"use client";
import styles from "@/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/components/Home/FeaturedHighlight";
import CompletedPreview from "@/components/Home/CompletedPreview";
import { motion } from "framer-motion";
import Hero from "@/components/Home/Hero";
import HighlightsBar from "@/components/Home/HighlightsBar";
import MotivationHub from "@/components/Home/MotivationHub";
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <CompletedPreview />
        </motion.div>

        <MotivationHub />
      </section>
    </>
  );
};

export default Home;
