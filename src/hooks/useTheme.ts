"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference
    const stored = localStorage.getItem("coindle-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("coindle-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("coindle-theme", "light");
      }
      return next;
    });
  };

  return { dark, toggle };
}
