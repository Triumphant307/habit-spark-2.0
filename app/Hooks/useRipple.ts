import { useCallback } from "react";

export function useRipple() {
  return useCallback(
    (
      e: React.PointerEvent<HTMLElement>,
      target?: HTMLElement,
      forceCenter = false
    ) => {
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
      const rW = el.offsetWidth;
      const rH = el.offsetHeight;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rW, rH);
      const x = forceCenter
        ? rW / 2 - size / 2
        : (e.clientX - rect.left) * (rW / rect.width) - size / 2;
      const y = forceCenter
        ? rH / 2 - size / 2
        : (e.clientY - rect.top) * (rH / rect.height) - size / 2;
      const wrapper = document.createElement("span");
      const ripple = document.createElement("span");
      wrapper.className = "ripple-container";
      ripple.className = "ripple hold";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
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
