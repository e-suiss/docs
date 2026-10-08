import type { MDXComponents } from "mdx/types";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Callout } from "@/components/site/callout";
import { CodeBlock } from "@/components/site/code-block";
import { Button } from "@/components/ui/button";

/** A live component example, shown on a gray tile like apple.com's product tiles. */
function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="preview"
      className="not-prose mt-[1.2em] flex min-h-44 flex-wrap items-center justify-center gap-3 rounded-[18px] bg-surface-secondary p-10"
    >
      {children}
    </div>
  );
}

function Table(props: React.ComponentProps<"table">) {
  return (
    <div className="mt-[1.2em] overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: ({ href, ...props }) => <Anchor href={href} {...props} />,
    pre: (props) => <CodeBlock {...props} />,
    table: Table,
    Callout,
    Preview,
    Button,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
