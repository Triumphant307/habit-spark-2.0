import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackToTop from "@/app/components/BackToTop";
import NextTopLoader from "nextjs-toploader";
import { HabitProvider } from "@/app/context/HabitContext";

import "./globals.css";

export const metadata = {
  title: "HabitSpark",
  description: "Your smart habit tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="#22c55e;"
          height={3}
          showSpinner={false}
          speed={500}
          easing="ease"
          shadow={true}
          crawl={true}
          crawlSpeed={200}
        />
        <HabitProvider>
          <Header />
          <main>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              limit={2}
              containerClassName="custom-toast-container"
            />
            {children}
          </main>
          <Footer />
          <BackToTop />
        </HabitProvider>
      </body>
    </html>
  );
}
