"use client";

import React from "react";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import Sidebar from "./Sidebar";
import AppTopBar from "./AppTopBar";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { TimeTravelOverlay } from "sia-reactor/adapters/react";
import { time } from "../../core/state/app";

import "sia-reactor/styles/time-travel-overlay.css";

interface LayoutClientProps {
  children: React.ReactNode;
}

const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  const s = useReactor(appState);
  const isCollapsed = s.user.preferences.sidebarCollapsed;
  const pathname = usePathname();

  // Pages that should NOT have an app shell (sidebar/topbar)
  const noShellPages = ["/login", "/signup", "/onboarding", "/"];
  const isAppPage = !noShellPages.includes(pathname);

  // Dynamic padding based on sidebar state
  const paddingLeft = isAppPage ? (isCollapsed ? "94px" : "244px") : "0px";

  return (
    <div className="App_Layout">
      {isAppPage && <Sidebar />}

      <div
        className="App_Content"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          paddingLeft: isAppPage ? paddingLeft : "0px",
        }}
      >
        {!isAppPage && <Header />}
        {isAppPage && <AppTopBar />}

        <main
          style={{
            width: "100%",
            paddingBottom: isAppPage ? "100px" : "0px",
          }}
        >
          {children}
        </main>

        {!isAppPage && <Footer />}
        
        <TimeTravelOverlay time={time} color="#3b82f6" />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .App_Content {
            padding-left: 0 !important;
          }
          main {
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LayoutClient;
