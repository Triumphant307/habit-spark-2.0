"use client";

import { useCallback, useEffect, useState } from "react";
import Aos from "aos";
import styles from "@/Styles/Home/QuotesMotivation.module.css";
import { motion, AnimatePresence } from "framer-motion";

type Quote = {
  q: string;
  a: string;
};

const fallBackQuote: Quote[] = [
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
];

const QuotesMotivation = () => {
  const [quote, setQuote] = useState<Quote>(fallBackQuote[0]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const fetchQuote = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://zenquotes.io/api/random"
        )}`
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const quotes = JSON.parse(data.contents);

      if (Array.isArray(quotes) && quotes[0]?.q) {
        setQuote({ q: quotes[0].q, a: quotes[0].a });
      } else {
        throw new Error("Invalid API format");
      }
    } catch {
      const safeIndex = index % fallBackQuote.length;
      setQuote(fallBackQuote[safeIndex]);
    }
  }, [index]);

  useEffect(() => {
    fetchQuote();

    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => prev + 1);
        fetchQuote();
        setVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchQuote]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div
      className={styles.QuotesMotivation_Container}
      data-aos="zoom-in"
      data-aos-delay="200"
    >
      <h2 className={styles.QuotesMotivation_Title}>💭 Daily Motivational Quote</h2>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.QuotesMotivation_Quote}>
              “{quote.q}”
            </p>
            <p className={styles.QuotesMotivation_Author}>
              — {quote.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuotesMotivation;
