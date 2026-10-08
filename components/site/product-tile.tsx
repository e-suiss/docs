import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";

import { Anchor } from "@/components/site/anchor";
import type { Product } from "@/lib/products";
import { strings } from "@/lib/strings";

/** An apple.com-style tile: tone-on-tone card, large name, chevron links. */
export function ProductTile({
  product,
  size = "default",
  className,
}: {
  product: Product;
  size?: "default" | "large";
  className?: string;
}) {
  const base = `/docs/${product.slug}`;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[28px] p-8",
        size === "large" ? "min-h-90 md:p-11" : "min-h-64",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="text-[17px] font-semibold text-label-secondary">suiss</p>
        {product.status && (
          <span className="rounded-sm bg-control px-1.5 py-0.5 text-2xs font-medium text-label-secondary">
            {strings.preAlpha}
          </span>
        )}
      </div>
      <h3
        className={cn(
          "font-semibold",
          size === "large"
            ? "text-[48px] leading-[1.083] tracking-[-0.003em]"
            : "text-[32px] leading-[1.125] tracking-[0.004em]",
        )}
      >
        {product.name}
      </h3>
      <p
        className={cn(
          "text-pretty",
          size === "large"
            ? "text-[28px] leading-[1.143] tracking-[0.007em]"
            : "text-[21px] leading-[1.19] tracking-[0.011em]",
        )}
      >
        {product.tagline}
      </p>
      <p className="max-w-110 text-[17px] text-pretty text-label-secondary">{product.summary}</p>
      <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-[17px]">
        <Anchor href={base} className="group inline-flex items-center gap-0.5 text-link hover:underline">
          {strings.learnMore}
          <CaretRightIcon className="size-3.5" />
        </Anchor>
        {product.family === "interface" && (
          <Anchor
            href={`${base}/installation`}
            className="group inline-flex items-center gap-0.5 text-link hover:underline"
          >
            {strings.getStarted}
            <CaretRightIcon className="size-3.5" />
          </Anchor>
        )}
      </div>
    </div>
  );
}
