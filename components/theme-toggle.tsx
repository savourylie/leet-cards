"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = mounted ? `Switch to ${nextTheme} theme` : "Toggle theme";

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        aria-label={label}
        className="shadow-sm"
        disabled={!mounted}
        onClick={() => setTheme(nextTheme)}
        size="icon"
        title={label}
        variant="outline"
      >
        {isDark ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
        <span className="sr-only">{label}</span>
      </Button>
    </div>
  );
}
