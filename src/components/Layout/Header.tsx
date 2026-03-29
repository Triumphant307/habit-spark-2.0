"use client";

import Style from "@/Styles/Layout/Header.module.css";
import ThemeToggle from "@/Theme/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const Header: React.FC = () => {
  const pathname = usePathname();

  // Hide header on Auth and Onboarding pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/onboarding") return null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Intersection Observer to track active sections
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = ["hero", "features", "achievements"];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in top-middle area
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const navRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  // Smooth scroll handler
  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        window.history.pushState(null, "", `#${id === "hero" ? "" : id}`);
        setIsMenuOpen(false);
      }
    }
  };

  const navItems = [
    { label: "Overview", href: "/", id: "hero" },
    { label: "Features", href: "/#features", id: "features" },
    { label: "Milestones", href: "/#achievements", id: "achievements" },
    { label: "Tracker", href: "/tracker" },
  ];

  return (
    <header
      className={`${Style.Header_Container} ${
        isScrolled ? Style.Header_ContainerScrolled : ""
      }`}
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
        <Link href="/" className={Style.Header_LogoLink}>
          <h1 className={Style.Header_Title}>
            Habit<span className={Style.Header_Title_Spark}>Spark</span>
          </h1>
        </Link>
      </div>

      <nav
        className={`${Style.Header_Nav} ${isMenuOpen ? Style.open : ""}`}
        ref={navRef}
      >
        <ul className={Style.Header_NavList}>
          {navItems.map((item) => {
            const isActive = item.id
              ? activeSection === item.id && pathname === "/"
              : pathname === item.href;

            return (
              <li key={item.label} className={Style.Header_Nav_item}>
                <Link
                  href={item.href}
                  className={`${Style.Header_NavLink} ${isActive ? Style.active : ""}`}
                  onClick={(e) => item.id && handleScrollTo(e, item.id)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={Style.Header_Right}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
