import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackToTop from "@/app/components/BackToTop";
import NextTopLoader from "nextjs-toploader";
import NotificationInitializer from "@/app/components/NotificationInitializer";
import ServiceWorkerRegister from "@/app/components/ServiceWorkerRegister";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import "aos/dist/aos.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SpeedInsights />
        <ServiceWorkerRegister />
        <NotificationInitializer />
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
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
