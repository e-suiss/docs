"use client";

import { AnchorProvider, type TableOfContents, TOCItem } from "fumadocs-core/toc";

import { strings } from "@/lib/strings";

/** "On this page", styled after the Human Interface Guidelines' floating aside. */
export function Toc({ items }: { items: TableOfContents }) {
  if (items.length === 0) return null;

  return (
    <AnchorProvider toc={items} single>
      <nav aria-label={strings.onThisPage} className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-label">{strings.onThisPage}</p>
        <ul className="flex flex-col border-s border-separator">
          {items.map((item) => (
            <li key={item.url}>
              <TOCItem
                href={item.url}
                style={{ paddingInlineStart: `${(item.depth - 1) * 12}px` }}
                className="-ms-px block border-s border-transparent py-1 text-xs text-label-secondary transition-colors hover:text-label data-[active=true]:border-label-secondary data-[active=true]:text-label"
              >
                {item.title}
              </TOCItem>
            </li>
          ))}
        </ul>
      </nav>
    </AnchorProvider>
  );
}
