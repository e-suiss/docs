import type { Metadata } from "next";

import { ProductTile } from "@/components/site/product-tile";
import { products } from "@/lib/products";
import { strings } from "@/lib/strings";

export const metadata: Metadata = { title: strings.docsIndexTitle };

export default function DocsIndex() {
  return (
    <main className="bg-surface-secondary px-5.5 pt-16 pb-24">
      <div className="mx-auto max-w-245">
        <h1 className="text-[48px] leading-[1.083] font-semibold tracking-[-0.003em]">
          {strings.docsIndexTitle}
        </h1>
        <p className="mt-2 text-[21px] leading-[1.381] tracking-[0.011em] text-label-secondary">
          {strings.docsIndexSubtitle}
        </p>
        <div className="mt-12 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductTile key={product.slug} product={product} className="bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
