"use client";

import { ArrowUpRightIcon, SidebarIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";

import { Anchor } from "@/components/site/anchor";
import { useSidebar } from "@/components/ui/sidebar";
import { getProduct, type ProductSlug } from "@/lib/products";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

export function LocalNav({ slug }: { slug: ProductSlug }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const product = getProduct(slug);

  if (!product) return null;
  const base = `/docs/${product.slug}`;
  const owns = (path: string) => {
    const prefix = `${base}/${path.split("/")[1]}`;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  };
  const isActive = (path: string) => {
    if (path !== "") return owns(path);
    return !product.sections.some((section) => section.path !== "" && owns(section.path));
  };

  const cta =
    product.family === "interface"
      ? { label: strings.getStarted, href: `${base}/installation` }
      : { label: strings.github, href: product.repository };

  return (
    <div className="sticky top-0 z-40 border-b border-label/10 bg-surface/85 backdrop-blur-xl backdrop-saturate-180">
      <nav
        aria-label={product.name}
        className="mx-auto flex h-12 w-full max-w-[1680px] items-stretch gap-6 px-5 md:px-10"
      >
        <button
          type="button"
          aria-label={strings.menu}
          onClick={toggleSidebar}
          className="-ms-1.5 flex size-9 items-center justify-center self-center rounded-full outline-none hover:bg-label/6 focus-visible:focus-ring md:hidden"
        >
          <SidebarIcon className="size-4.5" />
        </button>
        <ul className="no-scrollbar flex min-w-0 items-stretch gap-6 overflow-x-auto max-sm:[mask-image:linear-gradient(to_right,black_85%,transparent)] max-sm:pe-6">
          {product.sections.map((section) => {
            const active = isActive(section.path);
            return (
              <li key={section.path} className="flex">
                <Anchor
                  href={`${base}${section.path}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center text-sm font-medium whitespace-nowrap tracking-[-0.01em] outline-none transition-colors duration-300 focus-visible:focus-ring",
                    active
                      ? "text-label after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-label"
                      : "text-label/55 hover:text-label",
                  )}
                >
                  {section.label}
                </Anchor>
              </li>
            );
          })}
        </ul>
        <div className="ms-auto hidden shrink-0 items-center gap-4 sm:flex">
          {product.status && (
            <span className="hidden rounded-full bg-label/6 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.02em] text-label-secondary uppercase sm:inline">
              {strings.preAlpha}
            </span>
          )}
          <Anchor
            href={cta.href}
            className="group flex items-center gap-1 text-sm font-medium whitespace-nowrap tracking-[-0.01em] outline-none focus-visible:focus-ring"
          >
            {cta.label}
            <ArrowUpRightIcon
              weight="bold"
              className={cn("size-3 transition-transform duration-500 group-hover:rotate-45", ease)}
            />
          </Anchor>
        </div>
      </nav>
    </div>
  );
}
