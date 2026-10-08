"use client";

import { SidebarIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";

import { Anchor } from "@/components/site/anchor";
import { strings } from "@/lib/strings";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { getProduct, type ProductSlug } from "@/lib/products";

/** The sticky product bar, modelled on apple.com's local navigation. */
export function LocalNav({ slug }: { slug: ProductSlug }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const product = getProduct(slug);

  if (!product) return null;
  const base = `/docs/${product.slug}`;
  // A section owns every page under its first path segment, e.g. /components/*.
  const isActive = (path: string) => {
    if (path === "") return pathname === base;
    const prefix = `${base}/${path.split("/")[1]}`;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  };

  const cta =
    product.family === "interface"
      ? { label: strings.getStarted, href: `${base}/installation` }
      : { label: strings.github, href: product.repository };

  return (
    <div
      className="sticky top-0 z-40 border-b border-label/16 bg-surface/80 backdrop-blur-xl backdrop-saturate-180 transition-colors duration-300 dark:border-label/24"
    >
      <nav
        aria-label={product.name}
        className="mx-auto flex h-13 max-w-360 items-center gap-2 px-4 md:px-5.5"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={strings.menu}
          onClick={toggleSidebar}
          className="-ms-2 md:hidden"
        >
          <SidebarIcon />
        </Button>
        <Anchor
          href={base}
          className="rounded-sm text-[21px] leading-none font-semibold tracking-[0.011em] outline-none focus-visible:focus-ring max-md:text-[19px]"
        >
          {product.name}
        </Anchor>
        {product.status && (
          <span className="ms-1 rounded-sm bg-control px-1.5 py-0.5 text-2xs font-medium text-label-secondary">
            {strings.preAlpha}
          </span>
        )}
        <ul className="ms-auto hidden items-center gap-6 md:flex">
          {product.sections.map((section) => {
            const href = `${base}${section.path}`;
            return (
              <li key={section.path}>
                <Anchor
                  href={href}
                  aria-current={isActive(section.path) ? "page" : undefined}
                  className={cn(
                    "text-xs text-label/80 transition-colors hover:text-link",
                    "aria-[current=page]:text-label aria-[current=page]:opacity-56 aria-[current=page]:hover:text-label",
                  )}
                >
                  {section.label}
                </Anchor>
              </li>
            );
          })}
        </ul>
        <Button
          size="xs"
          render={<Anchor href={cta.href} />}
          className="ms-auto h-6 px-2.75 text-xs md:ms-6"
        >
          {cta.label}
        </Button>
      </nav>
    </div>
  );
}
