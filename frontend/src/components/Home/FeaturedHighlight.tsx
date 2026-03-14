"use client";

import styles from "@/Styles/Home/FeaturedHighlight.module.css";
import { useEffect } from "react";
import Aos from "aos";
import Link from "next/link";

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
      href: "/suggestion",
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
    <section className={styles.FeaturedHighlight_Section}>
      <h2 className={styles.FeaturedHighlight_Heading}>Features</h2>
      <div className={styles.FeaturedHighlight_Grid}>
        {feature.map((item, index) => (
          <Link key={item.id} href={item.href} className={styles.FeaturedHighlight_Link}>
            <div
              key={index}
              className={styles.FeaturedHighlight_Card}
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <span className={styles.FeaturedHighlight_Icon}>{item.icon}</span>
              <h3 className={styles.FeaturedHighlight_FeatureTitle}>{item.title}</h3>
              <p className={styles.FeaturedHighlight_Description}>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHighlight;
