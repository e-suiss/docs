"use client";

import { cn } from "cn";
import * as React from "react";

import { strings } from "@/lib/strings";
import { Button } from "@/components/ui/button";

const RESET_AFTER = 1500;

/** A borderless DocC-style listing with an optional title and a text copy button. */
export function CodeBlock({
  title,
  className,
  children,
  ...props
}: React.ComponentProps<"pre"> & { title?: string }) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    const text = ref.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <figure
      data-slot="code-block"
      className="group/code relative mt-[0.8em] overflow-hidden rounded-[15px] bg-surface-secondary"
    >
      {title && (
        <figcaption className="flex h-10 items-center border-b border-separator ps-4 pe-16 text-xs text-label-secondary">
          <span className="truncate">{title}</span>
        </figcaption>
      )}
      <Button
        variant="plain"
        size="xs"
        onClick={copy}
        className="absolute end-1.5 top-2 text-xs"
      >
        {copied ? strings.copied : strings.copy}
      </Button>
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto py-3.5 ps-4 pe-20 font-mono text-[15px] leading-[1.667] tracking-[-0.027em]",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </figure>
  );
}
