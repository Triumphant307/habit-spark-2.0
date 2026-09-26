import { storageKey } from "@/core/store/app";

export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(theme) {
            try {
              theme = theme ? JSON.parse(theme).app.theme : undefined;
              document.documentElement.classList.toggle('dark', theme !== undefined ? theme === "dark" : window.matchMedia('(prefers-color-scheme: dark)').matches);
            } catch(e) {}
          })(localStorage.getItem('${storageKey}'));
        `,
      }}
    />
  );
}
