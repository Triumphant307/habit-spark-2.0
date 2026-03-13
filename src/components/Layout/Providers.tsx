"use client";

import { ToastContainer, Slide } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NotificationInitializer from "@/components/PWA/NotificationInitializer";
import NotificationSettings from "@/components/PWA/NotificationSettings";
import ServiceWorkerRegister from "@/components/PWA/ServiceWorkerRegister";
import UpdatePrompt from "@/components/PWA/UpdatePrompt";
import ErrorBoundary from "@/components/Core/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpeedInsights />
      <ServiceWorkerRegister />
      <NotificationInitializer />
      <UpdatePrompt />
      <NotificationSettings />
      <NextTopLoader
        color="#22c55e"
        height={3}
        showSpinner={false}
        speed={500}
        easing="ease"
        crawl={true}
        zIndex={9999}
        crawlSpeed={200}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        newestOnTop
        theme="dark"
        transition={Slide}
        toastClassName="custom-toast"
        progressClassName="custom-progress"
      />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
