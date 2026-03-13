import styles from "@/app/Styles/Tracker/Tracker.module.css";

export default function TrackerSkeleton() {
  return (
    <section className={styles.tracker}>
      <div className="tracker-page">
        <h2 className={styles.title}>🎯 Your Habits</h2>
      </div>

      {/* Search skeleton */}
      <div className={styles.searchSkeleton}>
        <div className={styles.skeletonBar} />
      </div>

      {/* Habit card skeletons */}
      <div className={styles.skeletonGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
          </div>
        ))}
      </div>
    </section>
  );
}
