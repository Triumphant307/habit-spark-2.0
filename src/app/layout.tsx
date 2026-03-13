import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import NextTopLoader from "nextjs-toploader";
import NotificationInitializer from "@/components/NotificationInitializer";
import NotificationSettings from "@/components/NotificationSettings";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import UpdatePrompt from "@/components/UpdatePrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import "aos/dist/aos.css";

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "HabitSpark - Smart Habit Tracker",
  description:
    "Build better habits with daily tracking, personalized suggestions, and progress insights.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HabitSpark",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              var isDark = theme !== null ? JSON.parse(theme) : window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (isDark) document.documentElement.classList.add('dark');
            } catch(e) {}
          })();
        `,
          }}
        />
      </head>
      <body>
        <SpeedInsights />
        <ServiceWorkerRegister />
        <NotificationInitializer />
        <UpdatePrompt />
        <NotificationSettings />
        <NextTopLoader
          color="#22c55e;"
          height={3}
          showSpinner={false}
          speed={500}
          easing="ease"
          shadow={true}
          crawl={true}
          zIndex={9999}
          crawlSpeed={200}
        />
        <Header />
        <main>
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
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
