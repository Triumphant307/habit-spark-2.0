import { useState, useEffect } from "react";
import { appState } from "@/core/state/state";

/**
 * A hook that bridges the Reactor core with React components.
 * It subscribes to a specific path in the appState and triggers
 * a re-render whenever that state changes.
 * 
 * @param path The path in the state to watch (e.g., "user.name" or "habits")
 * @returns The current value at that path
 */
export function useReactor<T>(path: string): T {
  // 1. Initialize React state with the current value from the Reactor
  const [value, setValue] = useState<T>(() => appState.get(path as any));

  useEffect(() => {
    // 2. Define the listener that updates React state
    const handler = () => {
      const latestValue = appState.get(path as any);
      setValue(latestValue);
    };

    // 3. Subscribe to the Reactor's event system
    appState.on(path as any, handler);

    // 4. Immediate sync to catch any changes between initialization and effect
    handler();

    // 5. Unsubscribe when the component unmounts
    return () => {
      appState.off(path as any, handler);
    };
  }, [path]);

  return value;
}
