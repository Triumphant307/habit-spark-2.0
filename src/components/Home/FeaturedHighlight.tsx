"use client";

import styles from "@/Styles/Home/FeaturedHighlight.module.css";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css"; // Ensure AOS styles are imported

import { LuCheck, LuSparkles, LuTrendingUp } from "react-icons/lu";

const FeaturedHighlight = () => {
  const features = [
    {
      id: 1,
      icon: (
        <LuCheck
          className={styles.FeatureIcon}
          style={{ color: "var(--color-brand-primary)" }}
        />
      ),
      title: "Track Daily Progress",
      description:
        "Easily monitor your daily habits and see how you're improving over time. Visualize your journey with intuitive daily logs.",
      href: "/tracker",
      visualText: "📊 Activity Heatmap",
    },
    {
      id: 2,
      icon: (
        <LuSparkles
          className={styles.FeatureIcon}
          style={{ color: "var(--color-status-warning)" }}
        />
      ),
      title: "Get Personalized Suggestions",
      description:
        "Receive tailored recommendations based on your preferences to help you build better habits that actually stick.",
      href: "/suggestion",
      visualText: "🧠 AI Habit Insights",
    },
    {
      id: 3,
      icon: (
        <LuTrendingUp
          className={styles.FeatureIcon}
          style={{ color: "var(--color-status-success)" }}
        />
      ),
      title: "Visualize Your Success",
      description:
        "Transform raw data into beautiful, insightful graphs and statistics that motivate you to stay consistent.",
      href: "/completed",
      visualText: "🏆 Achievement Gallery",
    },
  ];

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className={styles.FeaturedHighlight_Section}>
      {features.map((feature, index) => (
        <div key={feature.id} className={styles.FeatureRow}>
          <div
            className={styles.TextContent}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
          >
            <span className={styles.FeaturedHighlight_Icon}>
              {feature.icon}
            </span>
            <h2 className={styles.FeaturedHighlight_FeatureTitle}>
              {feature.title}
            </h2>
            <p className={styles.FeaturedHighlight_Description}>
              {feature.description}
            </p>
          </div>

          <div
            className={styles.VisualContent}
            data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
            data-aos-delay="200"
          >
            {/* 
              This is a placeholder for actual screenshots or Lottie animations. 
              The glass container styling currently handles the professional look. 
            */}
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                opacity: 0.5,
                color: "var(--text-secondary)",
              }}
            >
              {feature.visualText}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedHighlight;
