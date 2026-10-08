import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { Anchor } from "@/components/site/anchor";
import { Toc } from "@/components/site/toc";
import { source } from "@/lib/source";
import { strings } from "@/lib/strings";

function getDocPage(params: { product: string; slug?: string[] }) {
  return source.getPage([params.product, ...(params.slug ?? [])]);
}

export default async function Page(props: PageProps<"/docs/[product]/[[...slug]]">) {
  const page = getDocPage(await props.params);
  if (!page) notFound();

  const MDX = page.data.body;
  const { previous, next } = findNeighbour(source.getPageTree(), page.url, {
    separateRoot: true,
  });

  return (
    <div className="flex gap-12 px-5 pt-10 pb-20 md:px-10 xl:pe-6">
      <article className="mx-auto w-full max-w-205 min-w-0">
        <header className="mb-10">
          {page.data.eyebrow && (
            <p className="mb-2 text-[17px] font-semibold text-label-secondary">
              {page.data.eyebrow}
            </p>
          )}
          <h1 className="text-[32px] leading-[1.125] font-bold tracking-[0.004em] text-balance md:text-[40px] md:leading-[1.1] md:tracking-normal">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="mt-3 text-[21px] leading-[1.381] tracking-[0.011em] text-pretty text-label-secondary">
              {page.data.description}
            </p>
          )}
        </header>
        <div className="prose">
          <MDX components={getMDXComponents()} />
        </div>
        {(previous || next) && (
          <nav
            aria-label="Pagination"
            className="mt-16 grid gap-3 border-t border-separator pt-6 sm:grid-cols-2"
          >
            {previous && (
              <Anchor
                href={previous.url}
                className="group flex flex-col gap-1 rounded-[18px] bg-surface-secondary p-5 transition-colors hover:bg-surface-tertiary"
              >
                <span className="flex items-center gap-1 text-xs text-label-secondary">
                  <CaretLeftIcon className="size-3" />
                  {strings.previous}
                </span>
                <span className="font-semibold">{previous.name}</span>
              </Anchor>
            )}
            {next && (
              <Anchor
                href={next.url}
                className="group flex flex-col items-end gap-1 rounded-[18px] bg-surface-secondary p-5 text-end transition-colors hover:bg-surface-tertiary sm:col-start-2"
              >
                <span className="flex items-center gap-1 text-xs text-label-secondary">
                  {strings.next}
                  <CaretRightIcon className="size-3" />
                </span>
                <span className="font-semibold">{next.name}</span>
              </Anchor>
            )}
          </nav>
        )}
      </article>
      <aside className="sticky top-23 hidden h-fit w-48 shrink-0 xl:block">
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
