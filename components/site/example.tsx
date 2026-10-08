"use client";

import { cn } from "cn";
import * as React from "react";

import { ComponentPreview } from "@/components/site/component-preview";

type Kind = React.ComponentProps<typeof ComponentPreview>["kind"];

/** A live example with its code one tab away, like shadcn's preview / code pair. */
export function Example({
  kind,
  name,
  story,
  children,
}: {
  kind: Kind;
  name: string;
  story?: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div role="tablist" className="flex gap-5 border-b border-label/12">
        {(["preview", "code"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              "relative h-9 cursor-pointer text-sm font-medium capitalize tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
              tab === item
                ? "text-label after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:rounded-full after:bg-label"
                : "text-label/45 hover:text-label",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {/* Both stay mounted so a preview keeps its state across tab switches. */}
      <div hidden={tab !== "preview"}>
        <ComponentPreview kind={kind} name={name} story={story} />
      </div>
      <div hidden={tab !== "code"} className="[&>figure]:mt-[1.2em]">
        {children}
      </div>
    </div>
  );
}
