"use client";

import { useCallback, useEffect, useState } from "react";
import Aos from "aos";
import styles from "@/app/Styles/Home/QuotesMotivation.module.css";

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
    <section
      className={styles.QuotesMotivation}
      data-aos="zoom-in"
      data-aos-delay="200"
    >
      <h2 className={styles.title}>💭 Daily Motivational Quote</h2>

      <blockquote
        className={styles.quotes}
        style={{ opacity: visible ? 1 : 0 }}
      >
        “{quote.q}”
        <footer className={styles.author}>— {quote.a}</footer>
      </blockquote>
    </section>
  );
};

export default QuotesMotivation;
