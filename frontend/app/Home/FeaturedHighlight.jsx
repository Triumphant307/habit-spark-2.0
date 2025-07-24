import styles from "@/app/Styles/Home/FeaturedHighlight.module.css";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
// import { Link } from "react-router-dom";
const FeaturedHighlight = () => {
  // This component highlights the features of the HabitSpark app
  // Array of features to be displayed
  const feature = [
    {
      id: 1,
      icon: "✅",
      title: "Track Daily Progress",
      description:
        "Easily monitor your daily habits and see how you're improving over time.",
      href: "/tracker",
    },
    {
      id: 2,
      icon: "💡",
      title: "Get Personalized Suggestions",
      description:
        "Receive tailored recommendations to help you build better habits.",
      href: "/suggestions",
    },
    {
      id: 3,
      icon: "📈",
      title: "View Your Progress",
      description:
        "Visualize your achievements with insightful graphs and statistics.",
      href: "/completed",
    },
  ];
  // Initialize AOS (Animate On Scroll) for animations
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Render the features section
  // Each feature is displayed as a card with an icon, title, and description
  return (
    <section className={styles.festuresSection}>
      <h2 className={styles.featuresTitle}>Features</h2>
      <div className={styles.featuresContainer}>
        {/* {feature.map((item, index) => (
          <Link key={item.id} to={item.href} className={styles.featureLink}>
            <div
              key={index}
              className={styles.featureCard}
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <span className={styles.featureIcon}>{item.icon}</span>
              <h3 className={styles.featureTitle}>{item.title}</h3>
              <p className={styles.featureDescription}>{item.description}</p>
            </div>
          </Link>
        ))} */}
      </div>
    </section>
  );
};

export default FeaturedHighlight;
