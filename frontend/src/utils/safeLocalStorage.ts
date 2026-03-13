/**
 * Safe localStorage wrapper with error handling
 * Prevents crashes in private browsing mode or when quota exceeded
 */

type StorageValue = string | null;

export const safeLocalStorage = {
  /**
   * Safely set an item in localStorage
   * @returns true if successful, false if failed
   */
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error instanceof DOMException) {
        // QuotaExceededError, SecurityError, etc.
        console.error(
          `localStorage.setItem failed for key "${key}":`,
          error.name,
        );
      } else {
        console.error(`Unexpected error in localStorage.setItem:`, error);
      }
      return false;
    }
  },

  /**
   * Safely get an item from localStorage
   * @returns the value or null if failed/not found
   */
  getItem(key: string): StorageValue {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`localStorage.getItem failed for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Safely remove an item from localStorage
   * @returns true if successful, false if failed
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`localStorage.removeItem failed for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};
