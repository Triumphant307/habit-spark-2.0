"use client";

export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              var isDark = theme !== null ? JSON.parse(theme) : window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (isDark) document.documentElement.classList.add('dark');
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
