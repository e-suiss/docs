"use client";

import { cn } from "cn";
import type * as React from "react";

import { strings } from "@/lib/strings";

type CalloutType = "note" | "tip" | "important" | "warning" | "deprecated";

// DocC asides: a tinted fill and a 1px border in the same hue.
const styles: Record<CalloutType, string> = {
  note: "border-separator bg-surface-secondary",
  tip: "border-teal/50 bg-teal/8",
  important: "border-yellow/60 bg-yellow/10",
  warning: "border-danger/50 bg-danger-surface",
  deprecated: "border-orange/50 bg-orange/8",
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {

  return (
    <aside
      data-slot="callout"
      data-type={type}
      className={cn("mt-[1.2em] rounded-[15px] border px-4 py-3.5 [&>p:first-of-type]:mt-1", styles[type])}
    >
      <p className="font-semibold">{title ?? strings[type]}</p>
      {children}
    </aside>
  );
}
