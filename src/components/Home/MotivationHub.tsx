"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "@/Styles/Home/MotivationHub.module.css";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "./LottieAniamtion";
import { LuSparkles } from "react-icons/lu";

type Quote = {
  q: string;
  a: string;
};

const fallBackQuotes: Quote[] = [
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  {
    q: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    a: "Winston Churchill",
  },
  {
    q: "The only way to do great work is to love what you do.",
    a: "Steve Jobs",
  },
  {
    q: "Your time is limited, don't waste it living someone else's life.",
    a: "Steve Jobs",
  },
  {
    q: "The best way to predict the future is to create it.",
    a: "Peter Drucker",
  },
  {
    q: "It does not matter how slowly you go as long as you do not stop.",
    a: "Confucius",
  },
];

const MotivationHub = () => {
  const [activeQuote, setActiveQuote] = useState<Quote>(fallBackQuotes[0]);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  const fetchRandomQuote = async (): Promise<Quote | null> => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://zenquotes.io/api/random",
        )}`,
      );

      if (!response.ok) return null;

      const data = await response.json();
      const quotes = JSON.parse(data.contents);

      if (Array.isArray(quotes) && quotes[0]?.q) {
        return { q: quotes[0].q, a: quotes[0].a };
      }
      return null;
    } catch {
      return null;
    }
  };

  const rotateQuote = useCallback(
    async (shouldTriggerTransition = false) => {
      if (shouldTriggerTransition) setIsFetchingQuote(true);

      setIsQuoteVisible(false);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const newQuote = await fetchRandomQuote();

      if (newQuote) {
        setActiveQuote(newQuote);
      } else {
        const currentIndex = fallBackQuotes.findIndex(
          (q) => q.q === activeQuote.q,
        );
        const nextIndex = (currentIndex + 1) % fallBackQuotes.length;
        setActiveQuote(fallBackQuotes[nextIndex]);
      }

      setIsQuoteVisible(true);
      setIsFetchingQuote(false);
    },
    [activeQuote.q],
  );

  useEffect(() => {
    rotateQuote();
  }, []);

  useEffect(() => {
    const autoRotateTimer = setInterval(() => {
      rotateQuote(true);
    }, 15000);

    return () => clearInterval(autoRotateTimer);
  }, [rotateQuote]);

  return (
    <section className={styles.MotivationHub_Section}>
      <motion.div
        className={styles.MotivationHub_Card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.VisualSide}>
          <div className={styles.LottieWrapper}>
            <LottieAnimation />
          </div>
        </div>

        <div className={styles.ContentSide}>
          <h2 className={styles.Title}>Fuel Your Journey</h2>
          <p className={styles.Subtitle}>
            Daily sparks of wisdom to keep your habits burning bright.
          </p>

          <div className={styles.QuoteWrapper}>
            <AnimatePresence mode="wait">
              {isQuoteVisible && (
                <motion.div
                  key={activeQuote.q}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <blockquote className={styles.QuoteText}>
                    “{activeQuote.q}”
                  </blockquote>
                  <cite className={styles.QuoteAuthor}>— {activeQuote.a}</cite>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.Actions}>
            <button
              className={styles.RefreshButton}
              onClick={() => rotateQuote(true)}
              disabled={isFetchingQuote}
            >
              <LuSparkles
                style={{
                  animation: isFetchingQuote
                    ? "spin 1s linear infinite"
                    : "none",
                }}
              />
              {isFetchingQuote ? "Fetching Spark..." : "New Spark"}
            </button>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default MotivationHub;
