import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { Metadata } from "next";
import type * as React from "react";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { Anchor } from "@/components/site/anchor";
import { PageActions } from "@/components/site/page-actions";
import { Toc } from "@/components/site/toc";
import { getProduct, products } from "@/lib/products";
import { source } from "@/lib/source";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

function getDocPage(params: { product: string; slug?: string[] }) {
  return source.getPage([params.product, ...(params.slug ?? [])]);
}

function Neighbour({
  direction,
  href,
  name,
}: {
  direction: "previous" | "next";
  href: string;
  name: React.ReactNode;
}) {
  const next = direction === "next";
  const Icon = next ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Anchor
      href={href}
      className={cn(
        "group flex items-center justify-between gap-6 border-t border-label/12 py-6 outline-none focus-visible:focus-ring md:py-8",
        !next && "flex-row-reverse",
      )}
    >
      <span className={cn("flex flex-col gap-2", !next && "items-end text-end")}>
        <span className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">
          {next ? strings.next : strings.previous}
        </span>
        <span
          className={cn(
            "text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700",
            next ? "group-hover:translate-x-2" : "group-hover:-translate-x-2",
            ease,
          )}
        >
          {name}
        </span>
      </span>
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full border border-label/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-label group-hover:text-surface",
          ease,
        )}
      >
        <Icon className="size-4" />
      </span>
    </Anchor>
  );
}

export default async function Page(props: PageProps<"/docs/[product]/[[...slug]]">) {
  const params = await props.params;
  const page = getDocPage(params);
  if (!page) notFound();

  const product = getProduct(params.product);
  const number = product ? String(products.indexOf(product) + 1).padStart(2, "0") : "";
  const eyebrow = page.data.eyebrow;
  const kind =
    eyebrow && product && eyebrow !== product.name && eyebrow !== `suiss ${product.name}` ? eyebrow : undefined;
  const MDX = page.data.body;
  const { previous, next } = findNeighbour(source.getPageTree(), page.url, {
    separateRoot: true,
  });

  return (
    <div className="flex gap-12 px-5 pt-14 pb-24 md:px-10 md:pt-20 xl:pe-10">
      <article className="mx-auto w-full max-w-205 min-w-0">
        <header className="mb-14 flex flex-col gap-5 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
              ({number}) {product?.name}
              {kind && <span className="text-label-tertiary"> · {kind}</span>}
            </p>
            <PageActions markdownUrl={`/llms.mdx${page.url}`} />
          </div>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-balance">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="max-w-2xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.38] tracking-[-0.02em] text-pretty text-label-secondary">
              {page.data.description}
            </p>
          )}
        </header>
        <div className="prose">
          <MDX components={getMDXComponents()} />
        </div>
        {(previous || next) && (
          <nav aria-label="Pagination" className="mt-24 border-b border-label/12">
            {next && <Neighbour direction="next" href={next.url} name={next.name} />}
            {previous && <Neighbour direction="previous" href={previous.url} name={previous.name} />}
          </nav>
        )}
      </article>
      <aside className="sticky top-26 hidden h-fit w-52 shrink-0 xl:block">
        <Toc items={page.data.toc} />
      </aside>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams().map(({ slug }) => ({
    product: slug[0],
    slug: slug.slice(1),
  }));
}

export async function generateMetadata(
  props: PageProps<"/docs/[product]/[[...slug]]">,
): Promise<Metadata> {
  const page = getDocPage(await props.params);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
