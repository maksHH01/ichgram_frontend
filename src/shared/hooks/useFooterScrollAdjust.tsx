import { useEffect } from "react";

export const useFooterScrollAdjust = () => {
  useEffect(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;

    const isAtBottom = scrollTop + windowHeight >= docHeight - 50;

    if (isAtBottom) {
      window.scrollBy({ top: -160, behavior: "auto" });
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);
};
