/**
 * App Version Configuration
 *
 * Update these values when releasing new versions.
 * - APP_VERSION: Semantic version string
 * - REQUIRES_REINSTALL: Set to true when icon/manifest changes require fresh install
 * - REINSTALL_MESSAGE: Message shown to users when reinstall is recommended
 */

export const APP_VERSION = "2.0.0";

// Set to true when you make changes that benefit from reinstall (icons, manifest, etc.)
export const REQUIRES_REINSTALL = false;

// Version that requires reinstall (users with versions before this should reinstall)
export const REINSTALL_FROM_VERSION = "0.0.0";

export const REINSTALL_MESSAGE =
  "A new version of HabitSpark is available with improved icons and features. For the best experience, please reinstall the app from your browser.";

export const WHATS_NEW = [
  "New app icon design",
  "Improved offline support",
  "Better performance",
];
