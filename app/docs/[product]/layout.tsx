import { notFound } from "next/navigation";
import * as React from "react";

import { DocsSidebar } from "@/components/site/docs-sidebar";
import { LocalNav } from "@/components/site/local-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getProduct, products } from "@/lib/products";
import { getProductTree } from "@/lib/tree";

export function generateStaticParams() {
  return products.map((product) => ({ product: product.slug }));
}

function ChromeSkeleton() {
  return <div className="h-12 border-b border-label/10 bg-surface" />;
}

export default function ProductLayout(props: LayoutProps<"/docs/[product]">) {
  return (
    <React.Suspense fallback={<ChromeSkeleton />}>
      <ProductChrome params={props.params}>{props.children}</ProductChrome>
    </React.Suspense>
  );
}

async function ProductChrome(props: { params: LayoutProps<"/docs/[product]">["params"]; children: React.ReactNode }) {
  const { product: slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const tree = getProductTree(product.slug);
  const nodes = tree ? [...(tree.index ? [tree.index] : []), ...tree.children] : [];

  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col">
      <LocalNav slug={product.slug} />
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 md:ps-6">
        <DocsSidebar nodes={nodes} />
        <div className="min-w-0 flex-1">{props.children}</div>
      </div>
    </SidebarProvider>
  );
}
