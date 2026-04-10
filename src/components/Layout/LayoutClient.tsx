"use client";

import React from "react";
import { useReactor } from "@/Hooks/useReactor";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

interface LayoutClientProps {
  children: React.ReactNode;
}

const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  const isCollapsed = useReactor<boolean>("user.preferences.sidebarCollapsed");
  const pathname = usePathname();

  // Pages that should NOT have a sidebar or special padding
  const noSidebarPages = ["/login", "/signup", "/onboarding", "/"];
  const isAppPage = !noSidebarPages.includes(pathname);

  // Dynamic padding based on sidebar state and screen size
  const paddingLeft = isAppPage ? (isCollapsed ? "94px" : "244px") : "0px";

  return (
    <div className="App_Layout">
      <Sidebar />
      <div
        className="App_Content"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <main
          style={{
            paddingLeft: isAppPage
              ? `var(--sidebar-width, ${paddingLeft})`
              : "0px",
            paddingBottom: isAppPage ? "var(--mobile-nav-height, 0px)" : "0px",
          }}
        >
          {children}
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          main {
            padding-left: 0 !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LayoutClient;
