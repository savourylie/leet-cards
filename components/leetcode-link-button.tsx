"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { ExternalLink } from "lucide-react";

import { getLeetCodeUrl } from "@/lib/leetcode-url";
import { cn } from "@/lib/utils";

type LeetCodeLinkButtonProps = {
  title: string;
  className?: string;
};

export function LeetCodeLinkButton({ title, className }: LeetCodeLinkButtonProps) {
  function handleActivate(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    window.open(getLeetCodeUrl(title), "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      aria-label={`Open ${title} on LeetCode`}
      title="Open on LeetCode"
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleActivate(event);
        }
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <ExternalLink className="h-3.5 w-3.5" />
    </button>
  );
}
