import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

import { Anchor } from "@/components/site/anchor";
import { products } from "@/lib/products";
import { strings } from "@/lib/strings";

export const metadata: Metadata = { title: strings.docsIndexTitle };

export default function DocsIndex() {
  return (
    <main className="mx-auto w-full max-w-[1680px] px-5 pt-20 pb-32 md:px-10 md:pt-28">
      <div className="mb-16 grid gap-6 md:mb-20 md:grid-cols-[1fr_3fr]">
        <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">(00) Docs</p>
        <div className="flex flex-col gap-5">
          <h1 className="text-[clamp(3.5rem,9vw,9rem)] leading-[0.86] font-semibold tracking-[-0.06em]">
            {strings.docsIndexTitle}.
          </h1>
          <p className="max-w-md text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.38] tracking-[-0.02em] text-label-secondary">
            {strings.docsIndexSubtitle}
          </p>
        </div>
      </div>

      <ul className="group/list border-b border-label/15">
        {products.map((product, index) => (
          <li key={product.slug} className="border-t border-label/15">
            <Anchor
              href={`/docs/${product.slug}`}
              className="group/row grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 outline-none transition-opacity duration-500 group-hover/list:opacity-25 hover:opacity-100! focus-visible:focus-ring md:grid-cols-[5rem_1fr_minmax(0,22rem)_3rem] md:py-7"
            >
              <span className="font-mono text-xs text-label-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-semibold tracking-[-0.055em] transition-transform duration-700 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover/row:translate-x-4">
                {product.name}
              </span>
              <span className="hidden flex-col gap-1 md:flex">
                <span className="text-[17px] tracking-[-0.02em]">{product.summary}</span>
                <span className="font-mono text-xs text-label-secondary uppercase">
                  {product.family}
                  {product.status ? ` · ${product.status}` : ""}
                </span>
              </span>
              <span className="flex size-10 items-center justify-center rounded-full border border-label/20 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-transparent group-hover/row:bg-label group-hover/row:text-surface md:size-12">
                <ArrowUpRightIcon className="size-4" />
              </span>
            </Anchor>
          </li>
        ))}
      </ul>
    </main>
  );
}
