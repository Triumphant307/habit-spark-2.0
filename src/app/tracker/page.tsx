"use client";
import dynamic from "next/dynamic";
import TrackerSkeleton from "../components/Tracker/TrackerSkeleton";

// Dynamically import client component with no SSR
// This prevents hydration mismatch since the component only renders on the client
const TrackerClient = dynamic(
  () => import("../components/Tracker/TrackerClient"),
  {
    ssr: false,
    loading: () => <TrackerSkeleton />,
  },
);

export default function Tracker() {
  return <TrackerClient />;
}
