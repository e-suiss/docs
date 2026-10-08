"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Logo } from "@/components/site/logo";
import { Search } from "@/components/site/search";
import { products } from "@/lib/products";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

/** A link whose label rolls up to an identical copy on hover. */
function RollLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: string;
}) {
  return (
    <Anchor
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center overflow-hidden rounded-full px-4 text-sm leading-5 font-medium tracking-[-0.01em] text-label outline-none transition-colors duration-300 focus-visible:focus-ring",
        active ? "bg-label text-surface" : "hover:bg-label/8",
      )}
    >
      <span className="relative block overflow-hidden">
        <span className={cn("block transition-transform duration-500 group-hover:-translate-y-full", ease)}>
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0",
            ease,
          )}
        >
          {children}
        </span>
      </span>
    </Anchor>
  );
}

export function GlobalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const home = pathname === "/";

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu on navigation
  React.useEffect(() => setMenuOpen(false), [pathname]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      // The home hero is always light, so the bar keeps dark text over it in either theme.
      style={home && !menuOpen ? ({ "--label": "oklch(0.2316 0.0038 286.09)" } as React.CSSProperties) : undefined}
      className={cn("z-50 text-label", home ? "absolute inset-x-0 top-0" : "relative bg-surface")}
    >
      <nav
        aria-label="Global"
        className="relative z-10 mx-auto flex h-16 w-full max-w-[1680px] items-center gap-6 px-5 md:px-10"
      >
        <Anchor
          href="/"
          className="flex h-10 items-center rounded-sm outline-none focus-visible:focus-ring"
        >
          <Logo />
        </Anchor>

        <ul
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-1 lg:flex",
            home ? "bg-white/35 backdrop-blur-2xl backdrop-saturate-150" : "bg-label/5",
          )}
        >
          {products.map((product) => (
            <li key={product.slug}>
              <RollLink
                href={`/docs/${product.slug}`}
                active={pathname.startsWith(`/docs/${product.slug}`)}
              >
                {product.name}
              </RollLink>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-2">
          {/* The home hero has its own search field. */}
          {!home && (
            <Search className="size-10 rounded-full bg-label/5 text-label transition-colors duration-300 hover:bg-label/10" />
          )}
          <Anchor
            href="https://github.com/e-suiss"
            className={cn(
              "group hidden h-10 items-center gap-2 rounded-full bg-label ps-4.5 pe-1 text-sm font-medium text-surface outline-none focus-visible:focus-ring [--focus-ring-offset:3px] sm:flex",
              home && "bg-[#1d1d1f] text-white",
            )}
          >
            {strings.github}
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full bg-surface text-label transition-transform duration-500 group-hover:rotate-45",
                ease,
                home && "bg-white text-[#1d1d1f]",
              )}
            >
              <ArrowUpRightIcon weight="bold" className="size-3.5" />
            </span>
          </Anchor>
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={cn(
              "h-10 rounded-full px-4.5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:focus-ring lg:hidden",
              home && !menuOpen ? "bg-white/35 backdrop-blur-2xl backdrop-saturate-150" : "bg-label/5",
            )}
          >
            {menuOpen ? strings.close : strings.menu}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 flex flex-col overflow-y-auto bg-surface px-5 pt-24 pb-10 md:px-10 lg:hidden">
          <ul className="flex flex-col">
            {products.map((product, index) => (
              <li
                key={product.slug}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={cn(
                  "border-t border-label/15 transition-[opacity,translate] duration-700 starting:translate-y-4 starting:opacity-0",
                  ease,
                )}
              >
                <Anchor
                  href={`/docs/${product.slug}`}
                  className="flex items-baseline gap-4 py-3 outline-none focus-visible:focus-ring"
                >
                  <span className="font-mono text-xs text-label-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(2.75rem,12vw,5rem)] leading-[0.95] font-semibold tracking-tighter">
                    {product.name}
                  </span>
                </Anchor>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-6 border-t border-label/15 pt-6 text-[15px] font-medium">
            <Anchor href="/docs">{strings.documentation}</Anchor>
            <Anchor href="https://github.com/e-suiss">{strings.github}</Anchor>
          </div>
        </div>
      )}
    </header>
  );
}
