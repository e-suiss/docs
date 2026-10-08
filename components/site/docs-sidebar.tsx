"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { usePathname } from "next/navigation";

import { Anchor } from "@/components/site/anchor";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Group = { label?: string; nodes: PageTree.Node[] };

/** Splits a folder's children into groups at each separator ("---Label---" in meta.json). */
function groupNodes(nodes: PageTree.Node[]) {
  const groups: Group[] = [{ nodes: [] }];
  for (const node of nodes) {
    if (node.type === "separator") {
      groups.push({ label: String(node.name ?? ""), nodes: [] });
    } else {
      groups.at(-1)?.nodes.push(node);
    }
  }
  return groups.filter((group) => group.nodes.length > 0);
}

const itemClass =
  "h-8 rounded-lg text-[15px] tracking-[-0.015em] text-label/60 hover:bg-label/5 hover:text-label data-active:bg-label/6 data-active:font-semibold data-active:text-label";

/** Every page URL inside a folder, its own index page included. */
function urlsOf(nodes: PageTree.Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") return [node.url];
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...urlsOf(node.children)];
    return [];
  });
}

/**
 * A folder's own URL prefix: the path its pages share. Fumadocs lists a
 * folder's index.mdx as an ordinary child, so the prefix comes from the URLs.
 */
function prefixOf(folder: PageTree.Folder) {
  const urls = urlsOf(folder.index ? [folder.index, ...folder.children] : folder.children);
  if (urls.length === 0) return undefined;
  if (urls.length === 1) return urls[0].slice(0, urls[0].lastIndexOf("/"));
  const parts = urls.map((url) => url.split("/"));
  const shared: string[] = [];
  for (let index = 0; parts.every((segments) => segments[index] === parts[0][index]); index++) {
    if (index >= parts[0].length) break;
    shared.push(parts[0][index]);
  }
  return shared.join("/");
}

/**
 * Each folder (Components, Charts, …) is its own section with its own tab, so
 * the sidebar shows only the section being read: that folder's pages, or the
 * guides when the page is in none of them.
 */
function sectionNodes(nodes: PageTree.Node[], pathname: string): PageTree.Node[] {
  const folders = nodes.filter((node): node is PageTree.Folder => node.type === "folder");
  const current = folders.find((folder) => {
    const prefix = prefixOf(folder);
    return prefix !== undefined && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  });
  if (current) {
    const prefix = prefixOf(current);
    const children = current.children.map((child) =>
      child.type === "page" && child.url === prefix ? { ...child, name: "Overview" } : child,
    );
    return [...(current.index ? [{ ...current.index, name: "Overview" }] : []), ...children];
  }
  return nodes.filter((node) => node.type !== "folder");
}

function Pages({ nodes }: { nodes: PageTree.Node[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return nodes.map((node) => {
    if (node.type === "page") {
      return (
        <SidebarMenuItem key={node.url}>
          <SidebarMenuButton
            size="sm"
            isActive={pathname === node.url}
            className={itemClass}
            render={<Anchor href={node.url} onClick={() => setOpenMobile(false)} />}
          >
            {node.name}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    if (node.type === "folder") {
      return (
        <SidebarMenuItem key={node.$id ?? String(node.name)}>
          {node.index ? (
            <SidebarMenuButton
              size="sm"
              isActive={pathname === node.index.url}
              className={itemClass}
              render={<Anchor href={node.index.url} onClick={() => setOpenMobile(false)} />}
            >
              {node.name}
            </SidebarMenuButton>
          ) : (
            <span className="flex h-8 items-center px-2 text-sm text-label-secondary">
              {node.name}
            </span>
          )}
          <SidebarMenuSub>
            {node.children.map((child) =>
              child.type === "page" ? (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton
                    isActive={pathname === child.url}
                    className={itemClass}
                    render={<Anchor href={child.url} onClick={() => setOpenMobile(false)} />}
                  >
                    {child.name}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ) : null,
            )}
          </SidebarMenuSub>
        </SidebarMenuItem>
      );
    }
    return null;
  });
}

/**
 * The docs navigator: suiss UI's sidebar, pinned below the product bar, with
 * mono group labels in the style of the home page's section markers.
 */
export function DocsSidebar({ nodes: all }: { nodes: PageTree.Node[] }) {
  const pathname = usePathname();
  const nodes = sectionNodes(all, pathname);

  return (
    <Sidebar className="sticky top-12 h-[calc(100svh-(--spacing(12)))] border-e-0 [&>[data-slot=sidebar-inner]]:bg-surface">
      <SidebarContent className="py-8">
        {groupNodes(nodes).map((group, index) => (
          <SidebarGroup key={group.label ?? index}>
            {group.label && (
              <SidebarGroupLabel className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <Pages nodes={group.nodes} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
