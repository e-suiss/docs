"use client";

import Link from "next/link";
import type * as React from "react";

/**
 * A Next.js link that accepts plain anchor props, for components that take a
 * `render` element (Base UI) and pass `href` through props.
 */
export function Anchor({ href = "#", ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("http") || href.startsWith("#")) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
