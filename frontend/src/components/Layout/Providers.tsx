"use client";

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
        initialPosition={0.08}
        showAtBottom={false}
      />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
