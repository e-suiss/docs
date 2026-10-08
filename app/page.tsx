import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Gradient } from "@/components/site/gradient";
import { InstallCommand } from "@/components/site/install-command";
import { PlatformScroller } from "@/components/site/platform-scroller";
import { Bento } from "@/components/site/bento";
import { Search } from "@/components/site/search";
import { getProduct, products } from "@/lib/products";

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10";

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
      ({index}) {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden text-[#1d1d1f]">
      <Gradient preset="Halo" />
      <div className={cn(frame, "relative flex flex-col gap-10 pt-60 pb-12 md:pt-[26rem] md:pb-16")}>
        <h1 className="text-[clamp(3.5rem,9.5vw,9.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
          Build with suiss.
        </h1>
        <Search
          variant="field"
          className="h-14 w-full rounded-full bg-white/45 px-5 md:max-w-2xl text-[17px] tracking-[-0.02em] text-[#1d1d1f]/70 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white/60 md:h-16 md:px-6"
        />
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}>
      <Label index="01">Approach</Label>
      <p className="text-[clamp(2rem,4.4vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.045em] text-balance">
        Components you own.{" "}
        <span className="text-label-tertiary">
          Copy them into your project and change anything you like.
        </span>{" "}
        Services you can read.{" "}
        <span className="text-label-tertiary">Open source, on infrastructure you already run.</span>
      </p>
    </section>
  );
}

function ProductIndex() {
  return (
    <section className={cn(frame, "pb-32 md:pb-48")}>
      <div className="mb-8 flex items-end justify-between">
        <Label index="02">Products</Label>
        <p className="font-mono text-xs text-label-secondary">
          {String(products.length).padStart(2, "0")}
        </p>
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
              <span className="text-[clamp(3rem,9vw,9rem)] leading-[0.9] font-semibold tracking-[-0.055em] transition-transform duration-700 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover/row:translate-x-4">
                {product.name}
              </span>
              <span className="hidden flex-col gap-1 md:flex">
                <span className="text-[17px] tracking-[-0.02em]">{product.tagline}</span>
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
    </section>
  );
}

const interfaceProducts = [
  { slug: "ui", platforms: "React · Next.js · Vite", count: "221", unit: "pieces" },
  { slug: "uim", platforms: "React Native · Expo", count: "32", unit: "components" },
] as const;

function Interface() {
  return (
    <section className="pb-32 md:pb-48">
      <div className={cn(frame, "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]")}>
        <Label index="03">Interface</Label>
        <div className="flex flex-col gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Every piece is live.
          </h2>
          <p className="max-w-md text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-[1.35] tracking-[-0.02em] text-label-secondary">
            No screenshots. These are the components themselves, running on this page. Try
            them.
          </p>
        </div>
      </div>

      <div className={frame}>
        <Bento />
      </div>

      <div className={cn(frame, "mt-20 md:mt-28")}>
        <ul className="group/list border-b border-label/15">
          {interfaceProducts.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <li key={item.slug} className="border-t border-label/15">
                <Anchor
                  href={`/docs/${item.slug}`}
                  className="group/row grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-3 py-6 outline-none transition-opacity duration-500 group-hover/list:opacity-25 hover:opacity-100! focus-visible:focus-ring md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_3rem] md:py-8"
                >
                  <span className="text-[clamp(4rem,11vw,11rem)] leading-[0.8] font-semibold tracking-[-0.065em] transition-transform duration-700 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover/row:translate-x-4">
                    {product.name}
                  </span>
                  <span className="flex flex-col gap-1 max-md:col-span-2 max-md:row-start-2 md:pb-2">
                    <span className="text-[clamp(1.0625rem,1.4vw,1.3125rem)] tracking-[-0.02em]">
                      {product.tagline}
                    </span>
                    <span className="font-mono text-xs text-label-secondary uppercase">{item.platforms}</span>
                  </span>
                  <span className="flex items-baseline gap-2 md:pb-1">
                    <span className="text-[clamp(2.5rem,4vw,4rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums">
                      {item.count}
                    </span>
                    <span className="font-mono text-xs text-label-secondary uppercase">{item.unit}</span>
                  </span>
                  <span className="hidden size-12 items-center justify-center self-center rounded-full border border-label/20 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-transparent group-hover/row:bg-label group-hover/row:text-surface md:flex">
                    <ArrowUpRightIcon className="size-4" />
                  </span>
                </Anchor>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 md:mt-28">
          <p className="mb-6 font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
            Start in one line
          </p>
          <InstallCommand command="npx @esuiss/ui@latest init" />
        </div>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <PlatformScroller
      header={
        <div className={cn(frame, "grid gap-6 md:grid-cols-[1fr_3fr]")}>
          <Label index="04">Platform</Label>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Open services.{" "}
            <span className="text-label-tertiary">Built for people and agents.</span>
          </h2>
        </div>
      }
    />
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <ProductIndex />
      <Interface />
      <Platform />
    </main>
  );
}
