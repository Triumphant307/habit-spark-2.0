import { motion } from "framer-motion";
import { fadeInUpVariants } from "./HomeAnimations";
import LottieAnimation from "./LottieAniamtion";
import styles from "@/Styles/Home/Home.module.css";
function MotivationSection() {
  return (
    <>
      <motion.div
        style={{ textAlign: "center", padding: "2rem" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
      >
        <h2 className={styles.Home_Heading}>Stay Consistent, Stay Motivated</h2>
        <p className={styles.Home_Text}>
          Join us in building better habits and achieving your goals.
        </p>
        <LottieAnimation />
      </motion.div>
    </>
  );
}

export default MotivationSection;
