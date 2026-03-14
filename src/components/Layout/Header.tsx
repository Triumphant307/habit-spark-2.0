"use client";
import Style from "@/Styles/Layout/Header.module.css";
import ThemeToggle from "@/Theme/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
const Header: React.FC = () => {
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

  const navRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
  }, [isMenuOpen])

  // This component renders the header with a title and a responsive navigation menu
  return (
    <header
      className={`${Style.Header_Container} ${isScrolled ? Style.Header_ContainerScrolled : ""}`}
    >
      <div className={Style.Header_Left}>
        <button
          className={`${Style.Header_Hamburger} ${isMenuOpen ? Style.open : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          ref={hamburgerRef}
        >
          <span className={Style.Header_HamburgerBar} />
          <span className={Style.Header_HamburgerBar} />
          <span className={Style.Header_HamburgerBar} />
        </button>
        <h1 className={Style.Header_Title}>HabitSpark</h1>
      </div>

      <nav
        className={`${Style.Header_Nav} ${isMenuOpen ? Style.open : ""}`}
        ref={navRef}
      >
        <ul className={Style.Header_NavList}>
          <li className={Style.Header_Nav_item}>
            <Link
              href="/"
              className={`${Style.Header_NavLink} ${
                pathname === "/" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className={Style.Header_Nav_item}>
            <Link
              href="/suggestion"
              className={`${Style.Header_NavLink} ${
                pathname === "/suggestion" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Suggestions
            </Link>
          </li>
          <li className={Style.Header_Nav_item}>
            <Link
              href="/completed"
              className={`${Style.Header_NavLink} ${
                pathname === "/completed" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Completed
            </Link>
          </li>
          <li className={Style.Header_Nav_item}>
            <Link
              href="/tracker"
              className={`${Style.Header_NavLink} ${
                pathname === "/tracker" ? Style.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tracker
            </Link>
          </li>
        </ul>
      </nav>

      <div className={Style.Header_Right}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
