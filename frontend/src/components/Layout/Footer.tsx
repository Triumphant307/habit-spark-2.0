"use client";

import styles from "@/Styles/Layout/Footer.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on Auth and Onboarding pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding" ||
    pathname === "/dashboard" ||
    pathname === "/tracker" ||
    pathname === "/suggestion"
  )
    return null;

  return (
    <footer className={styles.Footer_Container}>
      <div className={styles.Footer_Brand}>HabitSpark © 2025</div>

      <ul className={styles.Footer_NavLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/suggestion">Suggestions</Link>
        </li>
        <li>
          <Link href="/completed">Completed</Link>
        </li>
        <li>
          <Link href="/tracker">Tracker</Link>
        </li>
      </ul>

      <div className={styles.Footer_Socials}>
        <a href="https://github.com/Triumphant307" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>
        <a href="https://x.com/UsuangbonT" target="_blank" rel="noreferrer">
          <FaTwitter />
        </a>
        <a href="https://www.linkedin.com/in/usuangbon-triumphant/" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </a>
      </div>

      <div className={styles.Footer_Credit}>
        Made with <span className={styles.Footer_HeartIcon}>❤️</span> by Triumphant_
      </div>
    </footer>
  );
};

export default Footer;
