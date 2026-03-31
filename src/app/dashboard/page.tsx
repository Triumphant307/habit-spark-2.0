"use client";
import dynamic from "next/dynamic";
import TrackerSkeleton from "@/components/Tracker/TrackerSkeleton";

// Dynamically import the new Dashboard orchestrator
const DashboardClient = dynamic(
  () => import("@/components/Dashboard/DashboardClient"),
  {
    ssr: false,
  },
);

export default function DashboardPage() {
  return <DashboardClient />;
}
