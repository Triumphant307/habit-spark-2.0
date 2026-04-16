"use client";

import React from "react";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import AppTopBar from "./AppTopBar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { TimeTravelOverlay } from "sia-reactor/adapters/react";
import { time } from "@/core/state/app";
import "sia-reactor/styles/time-travel-overlay.css";

interface LayoutClientProps {
  children: React.ReactNode;
}

// Routes that use the sidebar — public Header/Footer are suppressed here
const APP_ROUTES = ["/dashboard", "/tracker", "/suggestion", "/habit"];

const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  const s = useReactor(appState);
  const pathname = usePathname();

  // Pages that should NOT have a sidebar or special padding
  const noSidebarPages = ["/login", "/signup", "/onboarding", "/"];
  const isAppPage =
    !noSidebarPages.includes(pathname) &&
    APP_ROUTES.some((route) => pathname.startsWith(route));

  // Dynamic padding based on sidebar state and screen size
  const paddingLeft = isAppPage
    ? s.user.preferences.sidebarCollapsed
      ? "94px"
      : "244px"
    : "0px";

  return (
    <div className="App_Layout">
      {/* Public header — hidden on app routes */}
      {!isAppPage && <Header />}

      <Sidebar />
      <div
        className="App_Content"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          // Sidebar offset applied here so both AppTopBar and main are offset correctly
          paddingLeft: isAppPage
            ? `var(--sidebar-width, ${paddingLeft})`
            : "0px",
          paddingBottom: isAppPage ? "var(--mobile-nav-height, 0px)" : "0px",
          transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Shared sticky top bar — visible on all sidebar routes */}
        {isAppPage && <AppTopBar />}
        <main>{children}</main>
      </div>

      {/* Public footer + scroll-to-top — hidden on app routes */}
      {!isAppPage && <Footer />}
      {!isAppPage && <BackToTop />}

      <style jsx>{`
        @media (max-width: 768px) {
          .App_Content {
            padding-left: 0 !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
      <TimeTravelOverlay time={time} color="#3b82f6" />
    </div>
  );
};

export default LayoutClient;
