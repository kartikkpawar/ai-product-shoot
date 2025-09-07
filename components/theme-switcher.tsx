"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="fixed right-3 bottom-3 border-1 border-black/40 dark:border-white/40 p-2 rounded-full cursor-pointer">
      {theme === "light" ? (
        <Moon
          className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          onClick={() => setTheme("dark")}
        />
      ) : (
        <Sun
          className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
}
