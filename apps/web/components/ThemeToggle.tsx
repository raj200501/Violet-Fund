"use client";

import { useEffect, useState } from "react";

import { Button } from "@violetfund/ui";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("vf-theme") || "light";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem("vf-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
      {theme === "light" ? "Dark" : "Light"} mode
    </Button>
  );
}
