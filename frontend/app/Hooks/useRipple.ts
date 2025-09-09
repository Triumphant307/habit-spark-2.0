import { useCallback } from "react";
import "@/app/Styles/hooks/ripple.css";

export function useRipple() {
  return useCallback(
    (e: React.PointerEvent<HTMLElement>, target?: HTMLElement) => {
      const currentTarget = target || e.currentTarget;
      if (
        (e.target !== e.currentTarget &&
          (e.target as HTMLElement).matches(
            "button,[href],input,label,select,textarea,[tabindex]:not([tabindex='-1'])"
          )) ||
        (currentTarget as HTMLElement).hasAttribute("disabled")
      )
        return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.stopPropagation();
      const el = currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const wrapper = document.createElement("span");
      const ripple = document.createElement("span");
      wrapper.className = "ripple-container";
      ripple.className = "ripple hold";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      let canRelease = false;
      ripple.addEventListener("animationend", () => (canRelease = true), {
        once: true,
      });
      wrapper.appendChild(ripple);
      el.appendChild(wrapper);
      const release = () => {
        if (!canRelease)
          return ripple.addEventListener("animationend", release, {
            once: true,
          });
        ripple.classList.replace("hold", "fade");
        ripple.addEventListener("animationend", () => {
          ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(
            () => wrapper.remove()
          );
        });
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    },
    []
  );
}
