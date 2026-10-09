import type * as PageTree from "fumadocs-core/page-tree";

import { source } from "@/lib/source";

function containsUrl(nodes: PageTree.Node[], prefix: string): boolean {
  return nodes.some((node) => {
    if (node.type === "page") return node.url === prefix || node.url.startsWith(`${prefix}/`);
    if (node.type === "folder") {
      return (
        (node.index !== undefined && node.index.url.startsWith(prefix)) ||
        containsUrl(node.children, prefix)
      );
    }
    return false;
  });
}

export function getProductTree(product: string) {
  const tree = source.getPageTree();
  const page = source.getPage([product]);
  const prefix = page?.url ?? `/docs/${product}`;
  return tree.children.find(
    (node): node is PageTree.Folder =>
      node.type === "folder" &&
      ((node.index !== undefined && node.index.url === prefix) || containsUrl(node.children, prefix)),
  );
}
