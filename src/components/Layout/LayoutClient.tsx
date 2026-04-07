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

  // Dynamic padding based on sidebar state (Width + Margins + Buffer)
  const paddingLeft = isAppPage ? (isCollapsed ? "100px" : "280px") : "0px";

  return (
    <div className="App_Layout">
      <Sidebar />
      <div
        className="App_Content"
        style={{
          paddingLeft: isAppPage ? paddingLeft : "0px",
          transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutClient;
