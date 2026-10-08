"use client";

import { cn } from "cn";
import * as React from "react";

/** A long listing shown folded, with a button to read the rest. */
export function SourceCode({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div data-not-prose className="relative mt-[1.2em] [&>figure]:mt-0">
      <div className={cn(!open && "max-h-80 overflow-hidden")}>{children}</div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center rounded-b-[20px] bg-linear-to-t from-surface-secondary via-surface-secondary/85 to-transparent pb-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-8 cursor-pointer rounded-full bg-label px-4 text-[13px] font-medium text-surface outline-none focus-visible:focus-ring"
          >
            Expand
          </button>
        </div>
      )}
    </div>
  );
}
