"use client";
import styles from "@/Styles/Home/Home.module.css";
import FeaturedHighlight from "@/components/Home/FeaturedHighlight";
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

        <div id="hero">
          <Hero />
        </div>

        <HighlightsBar />

        <motion.div id="features" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <FeaturedHighlight />
        </motion.div>

        <motion.div
          id="achievements"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        ></motion.div>

        <div id="motivation">
          <MotivationHub />
        </div>
      </section>
    </>
  );
};

export default Home;
