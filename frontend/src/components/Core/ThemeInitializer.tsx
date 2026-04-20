"use client";

import { appState } from "@/core/state/app";

export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = ${appState.theme};
              var isDark = theme !== undefined ? theme : window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.classList.toggle('dark', isDark);
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
