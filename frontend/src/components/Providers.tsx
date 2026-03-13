"use client";

import { ToastContainer, Slide } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NotificationInitializer from "@/components/NotificationInitializer";
import NotificationSettings from "@/components/NotificationSettings";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import UpdatePrompt from "@/components/UpdatePrompt";
import ErrorBoundary from "@/components/ErrorBoundary";

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
