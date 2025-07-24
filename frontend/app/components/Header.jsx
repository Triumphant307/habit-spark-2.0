"use client";
import Style from "@/app/Styles/Header.module.css";
import ThemeToggle from "@/app/Theme/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll event and change header styl
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // This component renders the header with a title and a responsive navigation menu
  return (
    <header
      className={`${Style.header} ${isScrolled ? Style.headerScrolled : ""}`}
    >
      <h1 className={Style.header__title}>HabitSpark</h1>

      <button
        className={`${Style.hamburger} ${isMenuOpen ? Style.open : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        ref={hamburgerRef}
      >
        <span className={Style.bar} />
        <span className={Style.bar} />
        <span className={Style.bar} />
      </button>

      <nav
        className={`${Style.headerNav} ${isMenuOpen ? Style.open : ""}`}
        ref={navRef}
      >
        <ul className={Style.header__navlist}>
          <li className={Style.header__nav__item}>
            <Link
              href="/"
              className={`${Style.header__nav__link} ${
                pathname === "/" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className={Style.header__nav__item}>
            <Link
              href="/suggestion"
              className={`${Style.header__nav__link} ${
                pathname === "/suggestions" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Suggestions
            </Link>
          </li>
          <li className={Style.header__nav__item}>
            <Link
              href="/completed"
              className={`${Style.header__nav__link} ${
                pathname === "/completed" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Completed
            </Link>
          </li>
          <li className={Style.header__nav__item}>
            <Link
              href="/tracker"
              className={`${Style.header__nav__link} ${
                pathname === "/tracker" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tracker
            </Link>
          </li>
          <li
            className={Style.header__nav__item}
            onClick={() => setIsMenuOpen(false)}
          >
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
