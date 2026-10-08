import { notFound } from "next/navigation";

import { DocsSidebar } from "@/components/site/docs-sidebar";
import { LocalNav } from "@/components/site/local-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getProduct, products } from "@/lib/products";
import { getProductTree } from "@/lib/tree";

export function generateStaticParams() {
  return products.map((product) => ({ product: product.slug }));
}

export default async function ProductLayout(
  props: LayoutProps<"/docs/[product]">,
) {
  const { product: slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const tree = getProductTree(product.slug);
  const nodes = tree ? [...(tree.index ? [tree.index] : []), ...tree.children] : [];

  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col">
      <LocalNav slug={product.slug} />
      <div className="mx-auto flex w-full max-w-360 flex-1">
        <DocsSidebar nodes={nodes} />
        <div className="min-w-0 flex-1">{props.children}</div>
      </div>
    </SidebarProvider>
  );
}
