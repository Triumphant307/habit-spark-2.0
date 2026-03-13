import styles from "@/app/Styles/Footer.module.css";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer : React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>HabitSpark © 2025</div>

      <ul className={styles.navLinks}>
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

      <div className={styles.socials}>
        <a
          href="https://github.com/Triumphant307"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>
        <a href="https://x.com/UsuangbonT" target="_blank" rel="noreferrer">
          <FaTwitter />
        </a>
        <a
          href="https://www.linkedin.com/in/usuangbon-triumphant/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
      </div>

      <div className={styles.credit}>
        Made with <span className={styles.heart}>❤️</span> by Triumphant_
      </div>
    </footer>
  );
};

export default Footer;
