"use client";

import { storageKey } from "@/core/store/app";

export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('${storageKey}');
              theme = theme ? JSON.parse(theme).app.theme : undefined;
              var isDark = theme !== undefined ? theme === "dark" : window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.classList.toggle('dark', isDark);
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
